import axios from "axios";

export const fetchVersion = async () => {
  const response = await axios.get(`${window.location.origin}/version.json`, {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    },
  });

  return response.data;
};
