import mongoose from "mongoose";
import Articles from "../models/Articles.js";

export const createArticle = async (req, res) => {
  const { articleTitle, articleBody, articleTags = [], userPosted } = req.body;
  const userId = req.userId;

  if (!articleTitle?.trim() || !articleBody?.trim()) {
    return res.status(400).json({ message: "Article title and body are required" });
  }

  try {
    const article = new Articles({
      articleTitle: articleTitle.trim(),
      articleBody,
      articleTags: Array.isArray(articleTags) ? articleTags : [],
      userPosted,
      userId,
    });

    await article.save();
    res.status(201).json({ message: "Article posted successfully", article });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllArticles = async (_req, res) => {
  try {
    const articles = await Articles.find().sort({ createdAt: -1 });
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getArticleById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid article id" });
  }

  try {
    const article = await Articles.findById(id);
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateArticle = async (req, res) => {
  const { id } = req.params;
  const { articleTitle, articleBody, articleTags = [] } = req.body;
  const userId = req.userId;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid article id" });
  }

  try {
    const article = await Articles.findById(id);
    if (!article) return res.status(404).json({ message: "Article not found" });

    if (String(article.userId) !== String(userId)) {
      return res.status(403).json({ message: "Unauthorized to update this article" });
    }

    article.articleTitle = articleTitle?.trim() || article.articleTitle;
    article.articleBody = articleBody || article.articleBody;
    article.articleTags = Array.isArray(articleTags) ? articleTags : article.articleTags;

    await article.save();
    res.status(200).json({ message: "Article updated successfully", article });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteArticle = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid article id" });
  }

  try {
    const article = await Articles.findById(id);
    if (!article) return res.status(404).json({ message: "Article not found" });

    if (String(article.userId) !== String(userId)) {
      return res.status(403).json({ message: "Unauthorized to delete this article" });
    }

    await Articles.findByIdAndDelete(id);
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
