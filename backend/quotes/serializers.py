from rest_framework import serializers

from .models import Tag, Quote
from core.models import ULIDSerializerField
from core.utils.alerts import send_slack_alert


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["name"]


class QuoteSerializer(serializers.ModelSerializer):
    id = ULIDSerializerField()
    tags = TagSerializer(many=True, required=False)

    class Meta:
        model = Quote
        fields = "__all__"

    def to_internal_value(self, data):
        # Let DRF parse the normal fields first
        validated_data = super().to_internal_value(data)

        # Capture raw tags data and store for create/update
        raw_tags = data.get("tags", [])
        validated_data["tags"] = raw_tags

        return validated_data

    def create(self, validated_data):
        tags_data = validated_data.pop("tags", [])

        quote = Quote.objects.create(**validated_data)

        tag_objs = []
        for tag in tags_data:
            name = tag["name"] if isinstance(tag, dict) else tag
            tag_obj, _ = Tag.objects.get_or_create(name=name.title())
            tag_objs.append(tag_obj)

        quote.tags.set(tag_objs)

        send_slack_alert(quote)

        return quote

    def update(self, instance, validated_data):
        tags_data = validated_data.pop("tags", None)

        if tags_data is not None:
            instance.tags.clear()
            for tag in tags_data:
                tag_obj, _ = Tag.objects.get_or_create(name=tag["name"])
                instance.tags.add(tag_obj)

        return super().update(instance, validated_data)
