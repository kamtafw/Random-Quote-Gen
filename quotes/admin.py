from django import forms
from django.contrib import admin
from django.utils.html import format_html
from .models import Quote, Tag

admin.site.register(Tag)


class QuoteAdminForm(forms.ModelForm):
    class Meta:
        model = Quote
        fields = ["tags", "is_approved"]


@admin.action(description="Mark selected quotes as approved")
def approve_quotes(modeladmin, request, queryset):
    queryset.update(is_approved=True)


@admin.register(Quote)
class QuoteAdmin(admin.ModelAdmin):
    form = QuoteAdminForm
    readonly_fields = ("content", "author")
    list_display = (
        "id_short",
        "content_short",
        "author",
        "is_approved_badge",
        "created_at",
    )
    list_filter = ("is_approved", "created_at", "author")
    search_fields = ("content", "author")
    # list_editable = ("is_approved",)
    actions = [approve_quotes]

    def id_short(self, obj):
        return format_html('<a href="/admin/quotes/quote/{}/change/">...{}</a>', obj.pk, obj.id[-10:])

    id_short.short_description = "ID"

    def content_short(self, obj):
        return obj.content[:50] + "..." if len(obj.content) > 50 else obj.content

    content_short.short_description = "Content Preview"

    def is_approved_badge(self, obj):
        color = "green" if obj.is_approved else "red"
        text = "Approved" if obj.is_approved else "Pending"
        return format_html("<span style='color: {};'>{}</span>", color, text)

    is_approved_badge.short_description = "Approval Status"
