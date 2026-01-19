FROM python:3.11-slim

# set env vars to stop python from buffering logs (so you see them in real time)
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# install system dependencies (chrome needs a lot of libs)
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    unzip \
    curl \
    # these are the libs selenium needs that are missing in slim
    libnss3 \
    libxss1 \
    libasound2 \
    libgbm1 \
    && rm -rf /var/lib/apt/lists/*

# install google chrome
RUN wget -q -O /usr/share/keyrings/google-chrome.asc https://dl-ssl.google.com/linux/linux_signing_key.pub \
    && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-chrome.asc] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable

# install python deps
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# copy your code
COPY . .

# default command (overridable)
# TEST.PY IS TEMPORARY WHILE I REWRITE THE NEW SCRAPER USING SOCCERDATA
CMD ["python", "pipeline/main.py"]

# to enter container shell
# docker-compose run --rm harvester bash