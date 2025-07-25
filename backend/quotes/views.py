from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.filters import SearchFilter
from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django_ratelimit.decorators import ratelimit
from django_filters.rest_framework import DjangoFilterBackend

import random
import hashlib
import textwrap
import datetime
import cloudinary
import cloudinary.api
import cloudinary.uploader
from io import BytesIO
from cloudinary.exceptions import NotFound
from PIL import Image, ImageDraw, ImageFont


from .models import Quote, Tag
from .filters import QuoteFilter
from .serializers import QuoteSerializer, TagSerializer
from core.utils.image_generator import generate_daily_quote, generate_daily_image


class QuoteListCreateView(generics.ListCreateAPIView):
    queryset = Quote.objects.all().order_by("-created_at")
    serializer_class = QuoteSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = QuoteFilter

    @method_decorator(ratelimit(key="ip", rate="3/m", method="POST"))
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class QuoteRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Quote.objects.all()
    serializer_class = QuoteSerializer


@api_view(["GET"])
def random_quote_view(request):
    quote_ids = list(Quote.objects.filter(is_approved=True).values_list("id", flat=True))
    if not quote_ids:
        return Response({"error": "No quotes available"}, status=404)

    selected_id = random.choice(quote_ids)
    quote = Quote.objects.get(id=selected_id)
    serializer = QuoteSerializer(quote)
    return Response(serializer.data)


@api_view(["GET"])
def daily_quote_view(request):
    """
    API view to get the daily quote.
    Returns a quote selected deterministically based on the current date and fixed quote IDs.
    """

    daily_quote = generate_daily_quote()
    if daily_quote is None:
        return Response({"error": "No quotes available"}, status=404)

    serializer = QuoteSerializer(daily_quote)
    return Response(serializer.data)


class TagSearchView(generics.ListAPIView):
    """
    API view to search for tags by name.
    Returns a list of tags matching the search query.
    """

    serializer_class = TagSerializer
    filter_backends = [SearchFilter]
    queryset = Tag.objects.all()
    search_fields = ["name"]


@api_view(["GET"])
def related_quotes_view(request, pk):
    """
    API view to get quotes related to a specific quote.
    Returns a list of quotes associated with the tags of the given quote, excluding the quote itself.
    """
    try:
        quote = Quote.objects.get(pk=pk)
    except Quote.DoesNotExist:
        return Response({"error": "Quote not found"}, status=404)

    tags = quote.tags.all()
    related_quote_ids = Quote.objects.filter(tags__in=tags).exclude(pk=pk).values("id").distinct()
    related_quotes = Quote.objects.filter(id__in=[item["id"] for item in related_quote_ids])
    serializer = QuoteSerializer(related_quotes, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def daily_quote_image_view(request):
    """
    API view to get the image of the daily quote.
    Returns a PNG image containing the daily quote text and author.
    """
    quote = generate_daily_quote()
    if quote is None:
        return Response({"error": "No quotes available"}, status=404)

    # Create an image with the quote text
    image = Image.new("RGB", (800, 600), color=(255, 255, 255))
    draw = ImageDraw.Draw(image)
    try:
        font = ImageFont.truetype("arial.ttf", 28)
    except IOError:
        font = ImageFont.load_default()

    text = f'"{quote.content}"\n\n- {quote.author or "Anonymous"}'
    # Wrap the text to fit within the image width
    max_width = 80  # Adjust as needed for font size and image width
    wrapped_text = "\n".join(textwrap.wrap(text, width=max_width))
    draw.multiline_text((20, 100), text, fill=(0, 0, 0), font=font, spacing=4)

    # Save the image to a BytesIO object
    image_io = BytesIO()
    image.save(image_io, format="PNG")
    image_io.seek(0)

    return HttpResponse(image_io.getvalue(), content_type="image/png")


@api_view(["GET"])
def daily_image_view(request):
    """
    API view to upload the image of the daily quote.
    """
    today = datetime.date.today().isoformat()
    public_id = f"daily-quote/daily_quote_{today}"

    # Check if the image already exists in Cloudinary
    try:
        existing = cloudinary.api.resource(public_id, resource_type="image")
        return Response({"image_url": existing["secure_url"], "reused": True})
    except NotFound:
        pass  # Proceed to generate new one

    quote, buffer = generate_daily_image()
    if not quote:
        return Response({"detail": "No quotes available."}, status=500)

    # Upload the image to Cloudinary
    try:
        cloudinary_response = cloudinary.uploader.upload(buffer, public_id=public_id, overwrite=True, resource_type="image")
        image_url = cloudinary_response.get("secure_url")
        return Response(
            {
                "quote": quote.content,
                "author": quote.author,
                "tags": [t.name for t in quote.tags.all()],
                "image_url": image_url,
                "reused": False,
            },
        )
    except Exception as e:
        return Response({"error": str(e)}, status=500)
