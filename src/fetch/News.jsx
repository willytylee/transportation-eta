import axios from "axios";

export const fetchNews = async () => {
  const response = await axios.get(
    `https://www.881903.com/api/news/recent/traffic?limit=50`
  );

  return response.data.response.content;
};
