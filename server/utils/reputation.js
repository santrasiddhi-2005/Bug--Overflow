import Users from "../models/auth.js";

/**
 * Award badges based on current reputation and stats.
 * Returns the updated badges object (does not save).
 */
export const computeBadges = (user, stats = {}) => {
  const rep = user.reputation ?? 1;
  const bronze = new Set(user.badges?.bronze ?? []);
  const silver = new Set(user.badges?.silver ?? []);
  const gold = new Set(user.badges?.gold ?? []);

  // Reputation-based badges
  if (rep >= 1) bronze.add("Informed");
  if (rep >= 10) bronze.add("Enthusiast");
  if (rep >= 50) silver.add("Veteran");
  if (rep >= 200) gold.add("Expert");

  // Activity-based badges (caller provides stats)
  if (stats.hasAskedQuestion) bronze.add("Student");
  if (stats.hasAnswered) bronze.add("Teacher");
  if (stats.answerUpVotes >= 10) silver.add("Nice Answer");
  if (stats.questionUpVotes >= 10) silver.add("Nice Question");
  if (stats.answerUpVotes >= 25) gold.add("Great Answer");
  if (stats.questionViews >= 1000) gold.add("Popular Question");

  return {
    bronze: Array.from(bronze),
    silver: Array.from(silver),
    gold: Array.from(gold),
  };
};

/**
 * Change a user's reputation by `delta`, floor at 1,
 * recompute badges, persist, and return the updated user.
 */
export const updateReputation = async (userId, delta, stats = {}) => {
  const user = await Users.findById(userId);
  if (!user) return null;

  user.reputation = Math.max(1, (user.reputation ?? 1) + delta);
  user.badges = computeBadges(user, stats);
  await user.save();
  return user;
};

/**
 * Push a notification to a user (fire-and-forget helper).
 */
export const addNotification = async (userId, message, link = "") => {
  try {
    await Users.findByIdAndUpdate(userId, {
      $push: { notifications: { message, link } },
    });
  } catch (err) {
    console.error("addNotification error:", err.message);
  }
};
