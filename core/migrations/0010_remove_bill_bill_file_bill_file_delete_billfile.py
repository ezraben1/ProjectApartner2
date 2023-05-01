# Generated by Django 4.2 on 2023-05-01 13:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0009_remove_apartment_images_remove_room_image_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='bill',
            name='bill_file',
        ),
        migrations.AddField(
            model_name='bill',
            name='file',
            field=models.FileField(blank=True, null=True, upload_to='bill_files/'),
        ),
        migrations.DeleteModel(
            name='BillFile',
        ),
    ]
