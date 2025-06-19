export const getColorClasses = (accentColor) => {
  const colorClasses = {
    green: {
      bg: "bg-green-500",
      bgLight: "bg-green-500/20",
      border: "border-green-500/50",
      text: "text-green-500",
      glow: "shadow-green-500/20"
    },
    red: {
      bg: "bg-red-500",
      bgLight: "bg-red-500/20",
      border: "border-red-500/50",
      text: "text-red-500",
      glow: "shadow-red-500/20"
    },
    blue: {
      bg: "bg-blue-500",
      bgLight: "bg-blue-500/20",
      border: "border-blue-500/50",
      text: "text-blue-500",
      glow: "shadow-blue-500/20"
    }
  };

  return colorClasses[accentColor] || colorClasses.green;
};
