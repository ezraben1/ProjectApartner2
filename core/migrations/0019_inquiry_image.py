# Generated by Django 4.2 on 2023-05-05 15:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0018_inquiry_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='inquiry',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='inquiry/'),
        ),
    ]
