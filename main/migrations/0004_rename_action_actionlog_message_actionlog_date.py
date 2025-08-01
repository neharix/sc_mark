# Generated by Django 5.2.4 on 2025-07-19 11:35

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0003_actionlog'),
    ]

    operations = [
        migrations.RenameField(
            model_name='actionlog',
            old_name='action',
            new_name='message',
        ),
        migrations.AddField(
            model_name='actionlog',
            name='date',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
