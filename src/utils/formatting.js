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

export const formatDuration = (seconds) => {
  if (!seconds) return "0s";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
};

export const getIcon = (type) => {
  const icons = {
    feeding: "🍼",
    poop: "💩",
    pee: "💧",
  };
  return icons[type] || "❓";
};
