"""
A wrapper for the ULID library to ensure compatibility with Django models.

Key Features:
* `generate_ulid()`: 26-char Base32 timestamp-sortable IDs.
* `ULIDField`: Drop-in replacement for `models.UUIDField`/`CharField` for ULID generation.
* `ULIDModel`: Abstract base class with ULID primary key.
* `ULIDSerializerField`: DRF field that cleanly (de)serializes ULIDs.
* `slug_ulid()`: 22-char URL slug / hash derived from a ULID.
* `bulk_reid()`: Helper to re-ID existing rows (handle with care).
"""

from __future__ import annotations

import ulid
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError
from rest_framework import serializers

from .utils.ulid_generator import generate_ulid


class ULIDField(models.CharField):
    """A 26-char, lexicographically sortable ULID stored as CHAR(26)."""

    description = _("ULID (Universally Unique Lexicographically Sortable Identifier)")

    def __init__(self, *args, **kwargs):
        kwargs["max_length"] = 26
        kwargs.setdefault("default", generate_ulid)
        kwargs.setdefault("editable", False)
        super().__init__(*args, **kwargs)

    def to_python(self, value):
        if value is None or isinstance(value, ulid.ULID):
            return str(value) if value is not None else value
        try:
            return ulid.from_str(value)
        except ValueError:
            raise ValidationError(_("Invalid ULID format"))

    def from_db_value(self, value, expression, connection):
        return value

    def get_prep_value(self, value):
        return str(value) if value is not None else None

    def deconstruct(self):
        name, path, args, kwargs = super().deconstruct()
        kwargs.pop("max_length", None)
        kwargs.pop("default", None)
        kwargs.pop("editable", None)
        return name, path, args, kwargs


class ULIDModel(models.Model):
    """Abstract base model with a ULID primary key."""

    id = ULIDField(primary_key=True, editable=False)

    class Meta:
        abstract = True


class ULIDSerializerField(serializers.CharField):
    """Read-only serializer field for ULIDs."""

    default_error_messages = {"invalid": _("Invalid ULID format")}

    def __init__(self, **kwargs):
        kwargs.setdefault("read_only", True)
        kwargs.setdefault("max_length", 26)
        super().__init__(**kwargs)

    def to_representation(self, value):
        if isinstance(value, ulid.ULID):
            return str(value)
        return value

    def to_internal_value(self, data):
        if isinstance(data, str):
            try:
                return ulid.from_str(data)
            except ValueError:
                raise serializers.ValidationError(_("Invalid ULID format"))
        return data


def bulk_reid(model, *, batch_size: int = 2000, dry_run: bool = False) -> None:
    """
    Re-ID every instance of a *model* with new ULIDs.

    Use with caution - this will change primary keys!
    Foreign-key constraints will break unless you cascade updates manually.
    Backup your database first!
    """
    from django.db import connection, transaction

    if not issubclass(model, models.Model):
        raise TypeError(_(f"Expected a Django model class, got {model.__class__.__name__}."))

    pk_field = model._meta.pk
    if not isinstance(pk_field, ULIDField):
        raise ValueError(_(f"Model {model.__name__} must use ULIDField as its primary key."))

    table = model._meta.db_table

    with transaction.atomic():
        with connection.cursor() as cursor:
            for obj in model.objects.all().iterator(chunk_size=batch_size):
                new_ulid = generate_ulid()
                if dry_run:
                    print(f"{obj.pk} -> {new_ulid}")
                else:
                    cursor.execute(
                        f"UPDATE {table} SET {pk_field.column} = %s WHERE {pk_field.column} = %s",
                        [new_ulid, obj.pk],
                    )
