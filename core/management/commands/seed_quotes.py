import ulid
from django.core.management.base import BaseCommand

from ...utils import generate_ulid
from quotes.models import Quote,Tag

QUOTES = [
    {
        "content": "Stay hungry, stay foolish.",
        "author": "Steve Jobs",
        "tags": [{"name": "Motivation"}],
        "source": "Stanford Commencement, 2005",
    },
    {
        "content": "Good artists copy, great artists steal.",
        "author": "Pablo Picasso",
        "tags": [{"name": "Creativity"}],
        "source": "",
    },
    {
        "content": "Premature optimization is the root of all evil.",
        "author": "Donald Knuth",
        "tags": [{"name": "Programming"}],
        "source": "The Art of Computer Programming",
    },
    {
        "content": "Simplicity is the soul of efficiency.",
        "author": "Austin Freeman",
        "tags": [{"name": "Productivity"}],
        "source": "",
    },
    {
        "content": "Talk is cheap. Show me the code.",
        "author": "Linus Torvalds",
        "tags": [{"name": "Programming"}, {"name": "Humor"}],
        "source": "",
    },
    {
        "content": "Programs must be written for people to read, and only incidentally for machines to execute.",
        "author": "Harold Abelson",
        "tags": [{"name": "Programming"}],
        "source": "Structure and Interpretation of Computer Programs",
    },
    {
        "content": "Experience is the name everyone gives to their mistakes.",
        "author": "Oscar Wilde",
        "tags": [{"name": "Humor"}],
        "source": "",
    },
    {
        "content": "Code is like humor. When you have to explain it, it's bad.",
        "author": "Cory House",
        "tags": [{"name": "Humor"}, {"name": "Programming"}],
        "source": "",
    },
    {
        "content": "First, solve the problem. Then, write the code.",
        "author": "John Johnson",
        "tags": [{"name": "Programming"}],
        "source": "",
    },
    {
        "content": "In theory, theory and practice are the same. In practice, they're not.",
        "author": "Yogi Berra",
        "tags": [{"name": "Humor"}],
        "source": "",
    },
    {
        "content": "An ounce of practice is worth more than tons of preaching.",
        "author": "Mahatma Gandhi",
        "tags": [{"name": "Wisdom"}],
        "source": "",
    },
    {
        "content": "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
        "author": "Martin Fowler",
        "tags": [{"name": "Programming"}],
        "source": "Refactoring",
    },
    {
        "content": "Simplicity is prerequisite for reliability.",
        "author": "Edsger W. Dijkstra",
        "tags": [{"name": "Programming"}],
        "source": "",
    },
    {
        "content": "The best way to get a project done faster is to start sooner.",
        "author": "Jim Highsmith",
        "tags": [{"name": "Productivity"}],
        "source": "",
    },
    {
        "content": "Software is a great combination of artistry and engineering.",
        "author": "Bill Gates",
        "tags": [{"name": "Motivation"}],
        "source": "",
    },
]


class Command(BaseCommand):
    help = "Seed the database with classic programming quotes."

    def handle(self, *args, **kwargs):
        created, skipped = 0, 0

        for q in QUOTES:
            tags_data = q.pop('tags',[])
            obj, was_created = Quote.objects.get_or_create(
                content=q["content"],
                defaults={
                    "id": generate_ulid(),
                    "author": q["author"],
                    "source": q["source"],
                },
            )

            if was_created:
                tags_objs = []
                for tag in tags_data:
                    tags_obj,_ = Tag.objects.get_or_create(name=tag["name"])
                    tags_objs.append(tags_obj)
                obj.tags.set(tags_objs)
                created += 1
            else:
                skipped += 1

        self.stdout.write(self.style.SUCCESS(f"Seed complete: {created} added, {skipped} skipped."))
