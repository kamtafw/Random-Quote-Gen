# Generated by Django 5.2.4 on 2025-07-25 21:47

import core.models
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quotes', '0005_alter_quote_content'),
    ]

    operations = [
        migrations.CreateModel(
            name='DailyQuoteCache',
            fields=[
                ('id', core.models.ULIDField(primary_key=True, serialize=False)),
                ('date', models.DateField(unique=True)),
                ('quote', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='quotes.quote')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
