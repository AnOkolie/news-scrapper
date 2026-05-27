import { prisma } from "./init.js";

export async function createArticleKeyword(finding) {
  const { a_id, keywords } = finding;

  for (const keyword of keywords) {
    await prisma.article_keywords.create({
      data: {
        a_id,
        keyword: keyword.toUpperCase(),
      },
    });
  }
}

export async function getArticleKeywords() {
  return await prisma.article_keywords.findMany();
}

export async function getArticleKeywordById(id) {
  return await prisma.article_keywords.findUnique({ where: { id } });
}

export async function updateArticleKeyword(id, data) {
  return await prisma.article_keywords.update({ where: { id }, data });
}

export async function deleteArticleKeyword(id) {
  return await prisma.article_keywords.delete({ where: { id } });
}

export async function countKeywords() {
  return await prisma.article_keywords.count();
}

export async function frequentKeywords() {
  return await prisma.article_keywords.groupBy({
    by: ["keyword"],
    _count: {
      keyword: true,
    },
    orderBy: {
      keyword: "desc",
    },
    take: 5,
  });
}
