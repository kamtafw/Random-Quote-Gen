from django.db.models import Count
from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
import random


from .models import Quote
from .serializers import QuoteSerializer


class QuoteListCreateView(generics.ListCreateAPIView):
    queryset = Quote.objects.all().order_by("-created_at")
    serializer_class = QuoteSerializer
    filterset_fields = ["category", "author"]

class QuoteRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Quote.objects.all()
    serializer_class = QuoteSerializer

@api_view(["GET"])
def random_quote_view(request):
    quotes = Quote.objects.all()
    if not quotes:
        return Response({"error": "No quotes available"}, status=404)
    quote = random.choice(quotes)
    serializer = QuoteSerializer(quote)
    return Response(serializer.data)
