#reset temp users(deletes them)

from django.core.management.base import BaseCommand
from core.models import CustomUser, TokenUsage
from datetime import timedelta
from django.utils import timezone

class Command(BaseCommand):
    help = 'Resets guest users'
    def handle(self, *args, **kwargs):
        CustomUser.objects.filter(is_temporary=True).delete()
        self.stdout.write(self.style.SUCCESS(f'Successfuly updated models. Deleted guest users'))
