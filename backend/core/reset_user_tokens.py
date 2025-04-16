#reset user and global tokens every day
from .models import CustomUser, TokenUsage
from datetime import timedelta
from django.utils import timezone

def reset_tokens():
    #reset user tokens, and resets the daily token max limit
    CustomUser.objects.update(daily_input_token_count=0)
    CustomUser.objects.update(daily_output_token_count=0)
    yesterday = timezone.now().date - timedelta(days=1)

    TokenUsage.objects.filter(date=yesterday).delete()
