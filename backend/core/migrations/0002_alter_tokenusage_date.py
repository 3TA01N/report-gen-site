# Generated by Django 5.1.5 on 2025-04-16 00:43

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tokenusage',
            name='date',
            field=models.DateField(default=django.utils.timezone.now),
        ),
    ]
