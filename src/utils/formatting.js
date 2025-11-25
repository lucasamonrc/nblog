export const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const dateStr = date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${dateStr} ${timeStr}`;
};

export const getIcon = (type) => {
  const icons = {
    feeding: "🍼",
    poop: "💩",
    pee: "💧",
  };
  return icons[type] || "❓";
};
