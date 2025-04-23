# Stage 1: Builder
FROM python:3.11-slim AS builder

# Install build dependencies only for compilation
RUN apt-get update && apt-get install -y \
    build-essential gcc g++ make clang \
    libatlas-base-dev liblapack-dev libopenblas-dev \
    libfreetype6-dev pkg-config libpng-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .

RUN pip install --upgrade pip setuptools wheel --no-cache-dir
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# Stage 2: Final Image
FROM python:3.11-slim AS final

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Create app user and app directory
RUN useradd -m -r appuser && mkdir /app && chown -R appuser /app

WORKDIR /app

# Copy only installed Python packages
COPY --from=builder /install /usr/local

# Copy your app code
COPY --chown=appuser:appuser . .

USER appuser

CMD ["gunicorn", "reportsite.wsgi:application", "--bind", "0.0.0.0:10000","--log-level", "debug", "--access-logfile", "-", "--error-logfile", "-", "--workers=1", "--threads=2"]

