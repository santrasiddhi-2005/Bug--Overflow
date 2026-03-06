import React from "react";

const getAvatarColor = (seedValue = "") => {
  const seed = String(seedValue).trim().toLowerCase();
  if (!seed) return "#4a7cff";

  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 45%)`;
};

const Avatar = ({
  children,
  backgroundColor,
  seed,
  px,
  py,
  color,
  borderRadius,
  fontSize,
  cursor,
}) => {
  const computedBackgroundColor = backgroundColor || getAvatarColor(seed || children);

  const style = {
    backgroundColor: computedBackgroundColor,
    padding: `${py} ${px}`,
    color: color || "white",
    borderRadius,
    fontSize,
    textAlign: "center",
    cursor: cursor || null,
    textDecoration: "none",
  };

  return <div style={style}>{children}</div>;
};

export default Avatar;
