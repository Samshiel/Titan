# Backend Dockerfile for FastAPI application
FROM python:3.11-slim

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY . .

# Expose the port the app runs on
EXPOSE 8800

# Command to run the application
CMD ["uvicorn", "apiService:app", "--host", "0.0.0.0", "--port", "8800"]

