#!/bin/sh
set -e
mkdir -p /app/var/log
crontab /app/etc/crontab
cron &
exec su -s /bin/sh appuser -c "exec gunicorn reportsite.wsgi:application \
    --bind 0.0.0.0:10000 \
    --log-level debug \
    --access-logfile - \
    --error-logfile - \
    --workers=1 \
    --threads=2"