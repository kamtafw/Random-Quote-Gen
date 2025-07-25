import os
import requests
from django.conf import settings


def send_slack_alert(quote):
    webhook_url = settings.SLACK_WEBHOOK_URL
    message = f"""
📢 *New Quote Suggestion*  
> "{quote.content}"  
– _{quote.author or "Anonymous"}_  
Tags: {", ".join(tag.name for tag in quote.tags.all())}
"""
    requests.post(webhook_url, json={"text": message.strip()})
    
