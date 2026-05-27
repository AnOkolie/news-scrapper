import { vi, describe, it, expect } from "vitest";

const analyzeTextMock = vi.hoisted(() => vi.fn());
const createArticleMock = vi.hoisted(() => vi.fn());
const createArticleTopicMock = vi.hoisted(() => vi.fn());
const createArticleKeywordMock = vi.hoisted(() => vi.fn());
const generateReportMock = vi.hoisted(() => vi.fn());

vi.mock("../analysis/text-pipeline.js", () => ({
  analyzeText: analyzeTextMock,
}));

vi.mock("../db/articles.js", () => ({
  createArticle: createArticleMock,
  sentimentOrder: vi.fn(),
}));

vi.mock("../db/article_topics.js", () => ({
  createArticleTopic: createArticleTopicMock,
  frequentTopics: vi.fn(),
  countTopics: vi.fn(),
}));

vi.mock("../db/article_keywords.js", () => ({
  createArticleKeyword: createArticleKeywordMock,
  frequentKeywords: vi.fn(),
  countKeywords: vi.fn(),
}));

vi.mock("../utils/cli_report.js", () => ({
  generateReport: generateReportMock,
}));

import { textAnalysis } from "../analysis/text_analysis.js";
import { analyzeText } from "../analysis/text-pipeline.js";
import { createArticle } from "../db/articles.js";
import { createArticleTopic } from "../db/article_topics.js";
import { createArticleKeyword } from "../db/article_keywords.js";
import { generateReport } from "../utils/cli_report.js";

describe("processes articles in correct batch sizes", () => {
  it("processes articles in batches of 30", async () => {
    const articles = Array.from({ length: 90 }, (_, i) => ({
      title: `Article ${i}`,
      url: `url-${i}`,
      age: new Date().toISOString(),
    }));

    const template = Array.from({ length: 30 }, (_, i) => ({
      title: `Article ${i}`,
      url: `url-${i}`,
      age: new Date().toISOString(),
    }));

    analyzeText.mockResolvedValue({
      results: template.map((a) => ({
        summary: "summary",
        sentiment: "neutral",
        confidence: 0.9,
        impact: "low",
        topics: ["tech"],
        keywords: ["ai"],
      })),
    });

    createArticle.mockResolvedValue({ id: 1 });
    createArticleTopic.mockResolvedValue();
    createArticleKeyword.mockResolvedValue();

    await textAnalysis(articles);

    // should be called 3 batches: 30 + 30 + 5
    expect(analyzeText).toHaveBeenCalledTimes(3);
  });
});

describe("makes sure AI response is as expected", () => {
  it("throws error if analysis response is invalid", async () => {
    const articles = [{ title: "A", url: "x", age: "2024" }];

    analyzeText.mockResolvedValue({
      results: null,
    });

    await expect(textAnalysis(articles)).rejects.toThrow(
      "Invalid analysis response format",
    );
  });
});

describe("print CLI report", () => {
  it("generates report after processing", async () => {
    const articles = [{ title: "A", url: "x", age: "2024" }];

    analyzeText.mockResolvedValue({
      results: [
        {
          summary: "summary",
          sentiment: "neutral",
          confidence: 0.8,
          impact: "low",
          topics: [],
          keywords: [],
        },
      ],
    });

    await textAnalysis(articles);

    expect(generateReport).toHaveBeenCalled();
  });
});

describe("save articles in db", async () => {
  it("saves article and related info in db", async () => {
    const articles = [{ title: "A", url: "x", age: "2024" }];

    analyzeText.mockResolvedValue({
      results: [
        {
          summary: "summary",
          sentiment: "positive",
          confidence: 0.9,
          impact: "high",
          topics: ["AI"],
          keywords: ["GPT"],
        },
      ],
    });

    createArticle.mockResolvedValue({ id: 123 });

    await textAnalysis(articles);

    expect(createArticle).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "A",
        url: "x",
      }),
    );

    expect(createArticleTopic).toHaveBeenCalledWith({
      a_id: 123,
      topics: ["AI"],
    });

    expect(createArticleKeyword).toHaveBeenCalledWith({
      a_id: 123,
      keywords: ["GPT"],
    });
  });
});
