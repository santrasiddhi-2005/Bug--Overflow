import mongoose from "mongoose";

const ArticleSchema = mongoose.Schema(
  {
    articleTitle: { type: String, required: "Article must have a title" },
    articleBody: { type: String, required: "Article must have a body" },
    articleTags: { type: [String], default: [] },
    userPosted: { type: String, required: "Article must have an author" },
    userId: { type: String, required: "Article must have a userId" },
  },
  { timestamps: true }
);

export default mongoose.model("Article", ArticleSchema);
