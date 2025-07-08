from django.urls import path
from .views import QuoteListCreateView, QuoteRetrieveUpdateDestroyView, random_quote_view

urlpatterns = [
    path("", QuoteListCreateView.as_view(), name="quote-list"),
    path("random/", random_quote_view, name="random-quote"),
    path("<str:pk>/", QuoteRetrieveUpdateDestroyView.as_view(), name="quote-detail"),
]
