FROM python:3.13-slim 

RUN apt-get update && apt-get install -y git --no-install-recommends && rm -rf /var/lib/apt/lists/*

WORKDIR /backend

COPY requirements.txt /backend/

RUN pip install --no-cache-dir -r requirements.txt

COPY . /backend/

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

