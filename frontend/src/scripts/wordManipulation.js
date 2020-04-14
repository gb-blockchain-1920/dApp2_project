export const wordCapitalization = phrase => {
  return phrase
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default wordCapitalization;
