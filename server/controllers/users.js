import mongoose from "mongoose";
import users from "../models/auth.js";

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await users.find();
    const allUserDetails = [];
    allUsers.forEach((user) => {
      allUserDetails.push({
        _id: user._id,
        name: user.name,
        about: user.about,
        tags: user.tags,
        location: user.location,
        links: user.links,
        joinedOn: user.joinedOn,
        lastSeen: user.lastSeen,
        reputation: user.reputation,
        badges: user.badges,
      });
    });
    res.status(200).json(allUserDetails);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const searchUsers = async (req, res) => {
  const { query, limit = 10, skip = 0 } = req.query;
  try {
    if (!query || query.trim() === "") {
      return res.status(200).json({ users: [], total: 0 });
    }

    const searchQuery = query.trim();
    const skipNum = parseInt(skip) || 0;
    const limitNum = Math.min(parseInt(limit) || 10, 50); // Max 50 results

    const searchFilter = {
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { about: { $regex: searchQuery, $options: "i" } },
        { tags: { $elemMatch: { $regex: searchQuery, $options: "i" } } },
      ],
    };

    const total = await users.countDocuments(searchFilter);
    const userList = await users
      .find(searchFilter)
      .select("_id name about tags joinedOn")
      .skip(skipNum)
      .limit(limitNum)
      .lean();

    res.status(200).json({ users: userList, total, limit: limitNum, skip: skipNum });
  } catch (error) {
    console.error("Search users error:", error);
    res.status(500).json({ message: "Error searching users", error: error.message });
  }
};

export const searchTags = async (req, res) => {
  const { query, limit = 10 } = req.query;
  try {
    if (!query || query.trim() === "") {
      return res.status(200).json({ tags: [] });
    }

    const searchQuery = query.trim();
    const limitNum = Math.min(parseInt(limit) || 10, 50); // Max 50 results

    // Import Questions model here to avoid circular dependency
    const Questions = (await import("../models/Questions.js")).default;

    // Get all tags from questions collection
    const questionsWithTags = await Questions.find(
      { questionTags: { $exists: true, $ne: [] } },
      { questionTags: 1 }
    )
      .lean()
      .exec();

    // Flatten and deduplicate tags
    let allTags = new Set();
    questionsWithTags.forEach((doc) => {
      if (doc.questionTags && Array.isArray(doc.questionTags)) {
        doc.questionTags.forEach((tag) => allTags.add(tag));
      }
    });

    // Also get tags from users
    const usersWithTags = await users
      .find({ tags: { $exists: true, $ne: [] } }, { tags: 1 })
      .lean()
      .exec();

    usersWithTags.forEach((doc) => {
      if (doc.tags && Array.isArray(doc.tags)) {
        doc.tags.forEach((tag) => allTags.add(tag));
      }
    });

    // Filter and limit tags
    const filteredTags = Array.from(allTags)
      .filter((tag) => tag && tag.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort()
      .slice(0, limitNum);

    res.status(200).json({ tags: filteredTags, total: filteredTags.length });
  } catch (error) {
    console.error("Search tags error:", error);
    res.status(500).json({ message: "Error searching tags", error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  const { id: _id } = req.params;
  const { name, about, tags, location, links } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("question unavailable...");
  }

  if (String(req.userId) !== String(_id)) {
    return res.status(403).json({ message: "Unauthorized to update this profile" });
  }

  try {
    const updatedProfile = await users.findByIdAndUpdate(
      _id,
      {
        $set: {
          name: name,
          about: about,
          tags: tags,
          location: location || "",
          links: {
            website: links?.website || "",
            x: links?.x || "",
            github: links?.github || "",
          },
        },
      },
      { new: true }
    );
    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(405).json({ message: error.message });
  }
};

export const getReputation = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json({ message: "Invalid user id" });
  }

  try {
    const user = await users.findById(_id).select("name reputation badges").lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ name: user.name, reputation: user.reputation, badges: user.badges });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
