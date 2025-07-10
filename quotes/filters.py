import django_filters
from .models import Quote


class QuoteFilter(django_filters.FilterSet):
    content = django_filters.CharFilter(lookup_expr="icontains")
    author = django_filters.CharFilter(lookup_expr="icontains")
    tags = django_filters.CharFilter(field_name="tags__name", lookup_expr="iexact")
    source = django_filters.CharFilter(lookup_expr="icontains")
    created_before = django_filters.DateTimeFilter(field_name="created_at", lookup_expr="lt")
    created_after = django_filters.DateTimeFilter(field_name="created_at", lookup_expr="gte")

    class Meta:
        model = Quote
        fields = ["content", "author", "tags", "source", "created_before", "created_after"]
