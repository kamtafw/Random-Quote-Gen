from rest_framework import serializers

from .models import Quote
from core.models import ULIDSerializerField


class QuoteSerializer(serializers.ModelSerializer):
    id = ULIDSerializerField()

    class Meta:
        model = Quote
        fields = "__all__"
