# Generated by Django 4.2 on 2023-05-04 10:32

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0011_contract_file'),
    ]

    operations = [
        migrations.CreateModel(
            name='Inquiry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('type', models.CharField(choices=[('defects', 'Defects'), ('questions', 'Questions'), ('payment', 'Payment'), ('problem', 'Problem'), ('other', 'Other')], max_length=20)),
                ('message', models.TextField()),
                ('apartment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='inquiries', to='core.apartment')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='inquiries', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]