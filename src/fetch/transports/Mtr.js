import axios from "axios";

export const fetchMtrEtas = async ({ stopId, route }) => {
  const response = await axios.get(
    `https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=${route}&sta=${stopId}`
  );

  const { data } = response.data;

  return data[Object.keys(data)[0]];
};
