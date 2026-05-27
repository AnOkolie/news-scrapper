import { prisma } from "./init.js";

export async function createArticleTopic(finding) {
  const { a_id, topics } = finding;

  for (const topic of topics) {
    await prisma.article_topics.create({
      data: {
        a_id,
        topic: topic.toUpperCase(),
      },
    });
  }
}

export async function getArticleTopics() {
  return await prisma.article_topics.findMany();
}

export async function getArticleTopicsById(id) {
  return await prisma.article_topics.findUnique({ where: { id } });
}

export async function updateArticleTopics(id, data) {
  return await prisma.article_topics.update({ where: { id }, data });
}

export async function deleteArticleTopics(id) {
  return await prisma.article_topics.delete({ where: { id } });
}

export async function countTopics() {
  return await prisma.article_topics.count();
}

export async function frequentTopics() {
  return await prisma.article_topics.groupBy({
    by: ["topic"],
    _count: {
      topic: true,
    },
    orderBy: {
      topic: "desc",
    },
    take: 10,
  });
}
