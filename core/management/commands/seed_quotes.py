import ulid
from django.core.management.base import BaseCommand

from ...utils import generate_ulid
from quotes.models import Quote

QUOTES = [
    {
        "content": "Stay hungry, stay foolish.",
        "author": "Steve Jobs",
        "category": "Motivation",
        "source": "Stanford Commencement, 2005",
    },
    {
        "content": "Good artists copy, great artists steal.",
        "author": "Pablo Picasso",
        "category": "Creativity",
        "source": "",
    },
    {
        "content": "Premature optimization is the root of all evil.",
        "author": "Donald Knuth",
        "category": "Programming",
        "source": "The Art of Computer Programming",
    },
    {
        "content": "Simplicity is the soul of efficiency.",
        "author": "Austin Freeman",
        "category": "Productivity",
        "source": "",
    },
    {
        "content": "Talk is cheap. Show me the code.",
        "author": "Linus Torvalds",
        "category": "Programming",
        "source": "",
    },
    {
        "content": "Programs must be written for people to read, and only incidentally for machines to execute.",
        "author": "Harold Abelson",
        "category": "Programming",
        "source": "Structure and Interpretation of Computer Programs",
    },
    {
        "content": "Experience is the name everyone gives to their mistakes.",
        "author": "Oscar Wilde",
        "category": "Humor",
        "source": "",
    },
    {
        "content": "Code is like humor. When you have to explain it, it's bad.",
        "author": "Cory House",
        "category": "Humor",
        "source": "",
    },
    {
        "content": "First, solve the problem. Then, write the code.",
        "author": "John Johnson",
        "category": "Programming",
        "source": "",
    },
    {
        "content": "In theory, theory and practice are the same. In practice, they're not.",
        "author": "Yogi Berra",
        "category": "Humor",
        "source": "",
    },
    {
        "content": "An ounce of practice is worth more than tons of preaching.",
        "author": "Mahatma Gandhi",
        "category": "Wisdom",
        "source": "",
    },
    {
        "content": "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
        "author": "Martin Fowler",
        "category": "Programming",
        "source": "Refactoring",
    },
    {
        "content": "Simplicity is prerequisite for reliability.",
        "author": "Edsger W. Dijkstra",
        "category": "Programming",
        "source": "",
    },
    {
        "content": "The best way to get a project done faster is to start sooner.",
        "author": "Jim Highsmith",
        "category": "Productivity",
        "source": "",
    },
    {
        "content": "Software is a great combination of artistry and engineering.",
        "author": "Bill Gates",
        "category": "Motivation",
        "source": "",
    },
]


class Command(BaseCommand):
    help = "Seed the database with classic programming quotes."

    def handle(self, *args, **kwargs):
        created, skipped = 0, 0

        for q in QUOTES:
            obj, was_created = Quote.objects.get_or_create(
                content=q["content"],
                defaults={
                    "id": generate_ulid(),
                    "author": q["author"],
                    "category": q["category"],
                    "source": q["source"],
                },
            )

            if was_created:
                created += 1
            else:
                skipped += 1

        self.stdout.write(self.style.SUCCESS(f"Seed complete: {created} added, {skipped} skipped."))
