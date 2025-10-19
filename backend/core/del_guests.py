from .models import CustomUser
from datetime import timedelta
from django.utils import timezone

def del_guests():
    CustomUser.objects.filter(is_temporary=True).delete()


