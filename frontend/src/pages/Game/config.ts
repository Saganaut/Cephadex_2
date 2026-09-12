const gameWsUrl = import.meta.env.VITE_WS_BASE_URL; // Your backend URL

export const getGameWSURL = (
  gameId?: number,
  userId?: number | null
): string | null => {
  if (gameId != null && userId != null)
    return `${gameWsUrl}/game/${gameId}/${userId}`;
  return null;
};
export const bgColors = [
  "bg-electric-violet",
  "bg-blaze-orange",
  "bg-aquamarine",
  "bg-tolopea",
  "bg-mariana-blue-100",
];
