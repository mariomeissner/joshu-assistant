FROM python:3.10-slim

WORKDIR /app

# Copy requirements first for better caching
COPY agent/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY agent/ .

# Expose the port the app runs on
EXPOSE $PORT

# Run the application
CMD uvicorn fast:app --host :: --port $PORT
