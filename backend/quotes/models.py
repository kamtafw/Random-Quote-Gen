from django.db import models
from core.models import ULIDModel


class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Quote(ULIDModel):
    content = models.TextField()
    author = models.CharField(max_length=100, blank=True)
    source = models.CharField(max_length=100, blank=True)
    tags = models.ManyToManyField(Tag, blank=True, related_name="quotes")
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        author = self.author
        content = self.content

        if len(content) > 50:
            content = content[:50] + "..."

        return f"{author or 'Unknown'}: {content}"


class DailyQuoteCache(ULIDModel):
    date = models.DateField(unique=True)
    quote = models.ForeignKey(Quote, null=True, on_delete=models.SET_NULL)
