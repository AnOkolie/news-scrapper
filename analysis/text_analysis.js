import { analyzeText } from "./text-pipeline.js";
import { createArticle, sentimentOrder } from "../db/articles.js";
import {
  countKeywords,
  createArticleKeyword,
  frequentKeywords,
} from "../db/article_keywords.js";
import {
  countTopics,
  createArticleTopic,
  frequentTopics,
} from "../db/article_topics.js";
import { generateReport } from "../utils/cli_report.js";

const BATCH_SIZE = 30;

export async function textAnalysis(articles) {
  await articlePipeline(articles);
  await printReport(articles);
}

async function articlePipeline(articles) {
  console.log(
    `Processing ${articles.length} articles in batches of ${BATCH_SIZE}`,
  );

  for (let i = 0; i < articles.length; i += BATCH_SIZE) {
    let endInd = Math.min(i + BATCH_SIZE, articles.length);
    let batch = articles.slice(i, endInd);
    console.log(
      `Batch ${i / BATCH_SIZE + 1}: processing ${batch.length} articles`,
    );

    // send 30 articles at a time to the text analysis pipeline
    // reduces the number of api calls and speeds up the process
    const analysis = await analyzeText(batch.map((a) => a.title));

    if (!analysis?.results || !Array.isArray(analysis.results)) {
      throw new Error("Invalid analysis response format");
    }

    if (analysis.results.length !== batch.length) {
      throw new Error("Mismatch between input and output size");
    }

    console.log("Sample result:", analysis.results?.[0]);

    for (let j = 0; j < batch.length; j++) {
      const article = batch[j];
      const result = analysis.results[j];

      //store in db
      await saveResults(article, result);
    }
  }
}

async function printReport(articles) {
  //Fetch metrics
  const sentiments = await sentimentOrder(); //returns the value associated with each sentiment (negative, positive, neutral)
  const topics = await frequentTopics();
  const keywords = await frequentKeywords();
  const topicCount = await countTopics();
  const keywordCount = await countKeywords();
  generateReport(
    articles,
    BATCH_SIZE,
    sentiments,
    topics,
    keywords,
    topicCount,
    keywordCount,
  );
}

async function saveResults(article, result) {
  const { summary, sentiment, confidence, impact, topics, keywords } = result;
  //create artice record
  const articleRecord = await createArticle({
    title: article.title,
    url: article.url,
    age: article.age,
    summary,
    sentiment,
    confidence,
    impact,
  });

  //store information on the topics referenced in the article
  await createArticleTopic({
    a_id: articleRecord.id,
    topics,
  });

  //store information on the keywords referenced in the article
  await createArticleKeyword({
    a_id: articleRecord.id,
    keywords,
  });
}
