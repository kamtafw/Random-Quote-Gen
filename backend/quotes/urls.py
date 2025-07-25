from django.urls import path
from .views import (
    QuoteListCreateView,
    QuoteRetrieveUpdateDestroyView,
    TagSearchView,
    random_quote_view,
    daily_quote_view,
    related_quotes_view,
    daily_quote_image_view,
    daily_quote_image_upload_view,
)

urlpatterns = [
    path("", QuoteListCreateView.as_view(), name="quote-list"),
    path("random/", random_quote_view, name="random-quote"),
    path("daily/image-upload/", daily_quote_image_upload_view, name="daily-quote-image-upload"),
    path("daily/image/", daily_quote_image_view, name="daily-quote-image"),
    path("daily/", daily_quote_view, name="daily-quote"),
    path("tags/", TagSearchView.as_view(), name="tag-search"),
    path("<str:pk>/", QuoteRetrieveUpdateDestroyView.as_view(), name="quote-detail"),
    path("<str:pk>/related/", related_quotes_view, name="related-quotes"),
]
