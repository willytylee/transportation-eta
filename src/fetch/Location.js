import axios from "axios";

export const fetchLocation = async ({ q }) => {
  const response = await axios.get(
    `https://geodata.gov.hk/gs/api/v1.0.0/locationSearch?q=${q}`
  );

  return response.data;
};
