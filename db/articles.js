import { prisma } from "./init.js";

export async function createArticle(article) {
  return await prisma.articles.upsert({
    where: {
      url: article.url,
    },
    update: {},
    create: {
      title: article.title,
      url: article.url,
      age: article.age,
      summary: article.summary,
      sentiment: article.sentiment,
      confidence: article.confidence,
      impact: article.impact,
    },
  });
}

export async function getArticles() {
  return await prisma.articles.findMany();
}

export async function getArticleById(id) {
  return await prisma.articles.findUnique({ where: { id } });
}

export async function updateArticle(id, data) {
  return await prisma.articles.update({ where: { id }, data });
}

export async function deleteArticle(id) {
  return await prisma.articles.delete({ where: { id } });
}

export async function sentimentOrder() {
  return await prisma.articles.groupBy({
    by: ["sentiment"],
    _count: {
      sentiment: true,
    },
  });
}
