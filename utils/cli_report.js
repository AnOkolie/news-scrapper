import { header, section, line, bar, getColumnWidth } from "./utils.js";

export function generateReport(
  articles,
  BATCH_SIZE,
  sentiments,
  topics,
  keywords,
  topicCount,
  keywordCount,
) {
  console.log();
  header("QA RUN SUMMARY");

  console.log(`Articles Scraped      : ${articles.length}`);
  console.log(
    `Batches Processed     : ${Math.ceil(articles.length / BATCH_SIZE)}`,
  );
  console.log(`Topics Stored         : ${topicCount}`);
  console.log(`Keywords Stored       : ${keywordCount}`);

  const sentimentWidth = getColumnWidth(sentiments.map((s) => s.sentiment));

  const topicWidth = getColumnWidth(topics.map((t) => t.topic));

  const keywordWidth = getColumnWidth(keywords.map((k) => k.keyword));

  section("SENTIMENT BREAKDOWN");

  const maxSentiment = Math.max(...sentiments.map((s) => s._count.sentiment));

  for (const { sentiment, _count } of sentiments) {
    const count = _count.sentiment;
    console.log(
      `${sentiment.padEnd(sentimentWidth)} ${bar(count, maxSentiment)} ${String(count).padStart(3)}`,
    );
  }

  section("TOP TOPICS");

  const maxTopics = Math.max(...topics.map((t) => t._count.topic));

  for (const { topic, _count } of topics) {
    const count = _count.topic;
    console.log(
      `${topic.padEnd(topicWidth)} ${bar(count, maxTopics)} ${String(count).padStart(3)}`,
    );
  }
  section("TOP KEYWORDS");

  const maxKeywords = Math.max(...keywords.map((k) => k._count.keyword));

  for (const { keyword, _count } of keywords) {
    const count = _count.keyword;
    let padEndValue = keyword.length < 12 ? 12 : keyword.length + 2;
    console.log(
      `${keyword.padEnd(keywordWidth)} ${bar(count, maxKeywords)} ${String(count).padStart(3)}`,
    );
  }

  section("ELAPSED TIME");
}
