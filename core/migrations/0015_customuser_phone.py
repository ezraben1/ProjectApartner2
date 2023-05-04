# Generated by Django 4.2 on 2023-05-04 11:11

from django.db import migrations
import phonenumber_field.modelfields


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0014_remove_inquiry_from_renter'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='phone',
            field=phonenumber_field.modelfields.PhoneNumberField(blank=True, max_length=128, null=True, region=None),
        ),
    ]
