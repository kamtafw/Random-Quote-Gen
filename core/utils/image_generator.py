import os
import hashlib
import datetime
import requests

from io import BytesIO
from django.conf import settings
from PIL import Image, ImageDraw, ImageFont

from quotes.models import Quote


FONT_PATH_TITLE = os.path.join(settings.BASE_DIR, "core", "assets", "PlayfairDisplay-Regular.ttf")
FONT_PATH_META = os.path.join(settings.BASE_DIR, "core", "assets", "Inter-Regular.ttf")

UNSPLASH_RANDOM_ENDPOINT = "https://api.unsplash.com/photos/random"


def fetch_unsplash_image(query="inspiration"):
    headers = {
        "Accept-Version": "v1",
        "Authorization": f"Client-ID {settings.UNSPLASH_ACCESS_KEY}",
    }
    params = {
        "query": query,
        "orientation": "squarish",
        "content-filter": "high",
    }

    response = requests.get(UNSPLASH_RANDOM_ENDPOINT, headers=headers, params=params)
    if response.status_code != 200:
        raise requests.HTTPError(f"Unsplash API failed: {response.status_code}")

    data = response.json()

    image_url = data["urls"]["regular"]
    photographer = data["user"]["name"]
    profile_link = data["user"]["links"]["html"]
    download_location = data["links"]["download_location"]

    # Log download to comply with API ToS
    requests.get(download_location, headers=headers)

    image_response = requests.get(image_url)
    if image_response.status_code != 200:
        raise requests.HTTPError(f"Failed to fetch image from Unsplash: {image_response.status_code}")

    try:
        image = Image.open(BytesIO(image_response.content)).convert("RGB")
    except Image.UnidentifiedImageError:
        raise Exception("Fetched content is not a valid image from Unsplash")

    attribution = f"Photo by {photographer} on Unsplash"
    return image, attribution


def draw_multiline_text(draw, text, font, position, max_width, line_height, fill):
    lines = []
    words = text.split()
    current_line = ""

    for word in words:
        test_line = f"{current_line} {word}".strip()
        if draw.textlength(test_line, font=font) <= max_width:
            current_line = test_line
        else:
            lines.append(current_line)
            current_line = word

    if current_line:
        lines.append(current_line)

    # Calculate total text height for vertical centering
    total_text_height = len(lines) * line_height
    y_start = position[1] + ((max_width - total_text_height) // 2 if total_text_height < max_width else 0)

    y_text = y_start
    for line in lines:
        draw.text((position[0], y_text), line, font=font, fill=fill)
        y_text += line_height
        y_text += line_height


def generate_daily_image_with_unsplash():
    """
    Generate a daily quote image with a background from Unsplash.
    """
    quote_ids = list(Quote.objects.values_list("id", flat=True))
    if not quote_ids:
        return None, None, None

    today = datetime.date.today().isoformat()
    hash_input = f"{today}".encode("utf-8")
    hash_value = hashlib.md5(hash_input).hexdigest()
    index = int(hash_value, 16) % len(quote_ids)

    quote = Quote.objects.filter(id=quote_ids[index]).first()
    if not quote:
        return None, None, None

    tags = [tag.name for tag in quote.tags.all()]
    tag = tags[0] if tags else "inspiration"

    # Fetch Unsplash image
    bg_image, attribution = fetch_unsplash_image(tag)

    # Create a new image with the Unsplash background
    bg_image = bg_image.resize((1080, 1080))
    draw = ImageDraw.Draw(bg_image)

    # Load fonts
    quote_font = ImageFont.truetype(FONT_PATH_TITLE, 50)
    author_font = ImageFont.truetype(FONT_PATH_META, 30)
    footer_font = ImageFont.truetype(FONT_PATH_META, 24)

    # Overlay dark translucent rectangle for text readability
    overlay = Image.new("RGBA", bg_image.size, (0, 0, 0, 128))  # Semi-transparent black
    bg_image = Image.alpha_composite(bg_image.convert("RGBA"), overlay).convert("RGB")

    # Draw quote text
    draw = ImageDraw.Draw(bg_image)
    margin_x = 100
    margin_y = 160
    max_width = bg_image.width - 2 * margin_x

    # Quote text
    quote_text = f"{quote.content.strip()}"
    author_text = f"- {quote.author or 'Anonymous'}"
    footer_text = "#DevRevTiva"
    credit_text = attribution

    # Draw quote text
    draw_multiline_text(draw, quote_text, quote_font, (margin_x, margin_y), max_width, 65, fill=(255, 255, 255))
    # Draw author text
    draw.text((margin_x, 880), author_text, font=author_font, fill=(220, 220, 220))
    # Draw footer text
    draw.text((margin_x, 980), footer_text, font=footer_font, fill=(200, 200, 200))
    # Draw credit text
    draw.text((margin_x, 1010), credit_text, font=footer_font, fill=(160, 160, 160))

    # Save to BytesIO
    buffer = BytesIO()
    bg_image.save(buffer, format="PNG")
    buffer.seek(0)

    return quote, buffer
