# 🧪 Hacker News QA + AI Analysis Pipeline

This project is a Playwright-based automation pipeline that scrapes the latest Hacker News articles, validates feed ordering, and enriches each article using OpenAI for sentiment analysis, summarization, and topic extraction. It also generates a CLI analytics report summarizing trends across the dataset.

---

## 🚀 Overview

The system performs the following steps:

1. Launches a Playwright browser
2. Scrapes up to 100 “newest” Hacker News articles
3. Validates that articles are sorted in correct chronological order
4. Extracts metadata (title, URL, timestamp)
5. Sends article titles to OpenAI for:
   - Sentiment analysis
   - Summary generation
   - Topic classification
   - Keyword extraction
6. Aggregates results into structured analytics
7. Outputs a CLI dashboard report

---

## 🧠 Features

### 📊 Feed Validation

- Ensures Hacker News “newest” feed is correctly sorted
- Uses Playwright assertions for validation during scraping

### 🤖 AI-Powered Enrichment

Each article is analyzed using OpenAI:

- Sentiment: positive / neutral / negative
- Summary: short explanation of the article
- Impact level: low / medium / high
- Topics: categorized themes
- Keywords: extracted key terms

### 📈 CLI Analytics Dashboard

The CLI report includes:

- Total articles scraped
- Batch processing breakdown
- Sentiment distribution (bar chart style)
- Top topics
- Top keywords

---

## 🛠️ Tech Stack

- **Playwright** – browser automation and scraping
- **Node.js** – runtime environment
- **OpenAI API** – NLP enrichment (sentiment + summarization)
- **JavaScript (ESM + CommonJS mix)**
- **Custom CLI utilities** – reporting and visualization

---

## 📁 Project Structure

```
qa_wolf_take_home/
├── utils/
│   ├── cli_report.js        # CLI analytics dashboard
│   ├── utils.js             # Formatting helpers (bars, sections, etc.)
│
├── text-pipeline.js         # OpenAI sentiment + summarization logic
├── scraper.js               # Playwright scraping + validation
├── .env.example             # Environment variable template
├── README.md
```

---

## ⚙️ Setup

### 1. Install dependencies

```bash
npm install
```

---

### 2. Configure environment variables

Create a `.env` file in the root directory:

```bash
OPENAI_API_KEY=your_api_key_here
```

(Optional if using DB later)

```bash
DATABASE_URL=your_database_url_here
```

---

### 3. Run the project

```bash
node scraper.js
```

---

## 📊 Example Output

### CLI Summary

```
QA RUN SUMMARY

Articles Scraped      : 100
Batches Processed     : 5
Topics Stored         : 32
Keywords Stored       : 148
```

### Sentiment Breakdown

```
positive     ████████████ 42
neutral      █████████ 35
negative     ██████ 23
```

### Top Topics

```
AI           ██████████ 18
Startups     ███████ 12
Security     █████ 9
```

---

## 🧩 Design Goals

This project was built to demonstrate:

- Reliable browser automation with Playwright
- Deterministic feed validation logic
- Integration of AI into structured data pipelines
- Scalable architecture for scraping + enrichment workflows
- Clean CLI-based observability layer

---

## 🔐 Security Notes

- `.env` files are excluded from version control
- API keys should never be committed
- Use `.env.example` for sharing configuration structure

---

## 🚀 Future Improvements

- Persist results in PostgreSQL
- Add trend detection over time
- Build a web dashboard (React)
- Cluster similar stories using embeddings
- Add scheduled runs (cron / queue system)
- Support multiple news sources beyond Hacker News

---

## 📌 Why this project matters

This project extends a simple scraping task into a full **AI-powered news intelligence pipeline**, combining:

- QA-style automation testing (Playwright validation)
- Data engineering (structured pipelines)
- AI/NLP processing (OpenAI integration)
- Observability (CLI analytics dashboard)

It demonstrates how automation + AI can transform raw feeds into structured insights.
