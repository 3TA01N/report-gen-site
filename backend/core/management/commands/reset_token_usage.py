#reset user and global tokens every day

from django.core.management.base import BaseCommand
from core.models import CustomUser, TokenUsage
from datetime import timedelta
from django.utils import timezone

class Command(BaseCommand):
    help = 'Resets individual user daily token usage, and deletes old entries in TokenUsage model'
    def handle(self, *args, **kwargs):
        #reset user tokens, and resets the daily token max limit
        CustomUser.objects.update(daily_input_token_count=0)
        CustomUser.objects.update(daily_output_token_count=0)
        yesterday = timezone.localtime().date() - timedelta(days=1)
        print(yesterday)
        TokenUsage.objects.filter(date=yesterday).delete()
        self.stdout.write(self.style.SUCCESS(f'Successfuly updated models. Deleted yesterday:{yesterday}'))
