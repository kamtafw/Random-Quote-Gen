from django.db.models import Count
from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
import random


from .models import Quote
from .filters import QuoteFilter
from .serializers import QuoteSerializer


class QuoteListCreateView(generics.ListCreateAPIView):
    queryset = Quote.objects.all().order_by("-created_at")
    serializer_class = QuoteSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = QuoteFilter

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
