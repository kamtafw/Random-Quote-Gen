import base64
import ulid
from django.utils.translation import gettext_lazy as _


def generate_ulid() -> str:
    """Generate a new ULID as a 26-char string."""
    return ulid.new().str


def slug_ulid(ulid_str: str | ulid.ULID) -> str:
    """Convert a ULID to a 22-char URL-safe slug using base64 encoding."""
    return base64.urlsafe_b64encode(ulid_str.bytes).rstrip(b"=").decode("ascii")
