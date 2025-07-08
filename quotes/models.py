from django.db import models
from core.models import ULIDModel


class Quote(ULIDModel):
    content = models.TextField()
    author = models.CharField(max_length=100, blank=True)
    category = models.CharField(max_length=50, blank=True)
    source = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        author = self.author
        content = self.content

        if len(content) > 50:
            content = content[:50] + "..."

        return f"{author or 'Unknown'}: {content}"
