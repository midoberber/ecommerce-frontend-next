import axios from "axios";

export function getErrorMessage(err: unknown, fallback: string) {
  if (!axios.isAxiosError(err)) return fallback;
  const message = err.response?.data?.message;
  if (Array.isArray(message)) return message.join("، ");
  return message ?? fallback;
}
