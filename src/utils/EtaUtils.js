import moment from "moment";
import axios from "axios";

export const etaTimeConverter = (timeString) => {
  let textReturn;

  if (timeString) {
    const mintuesLeft = moment(timeString).diff(moment(), "minutes");
    if (mintuesLeft === 0) {
      textReturn = "準備埋站";
    } else if (mintuesLeft <= 0) {
      textReturn = "已埋站";
    } else {
      textReturn = `${mintuesLeft}分鐘`;
    }
  } else {
    textReturn = "沒有班次";
  }

  return textReturn;
};

export const getStopList = () => {
  let kmbStopList = [];

  const kmbStopListLocal = localStorage.getItem("kmbStopList");
  if (kmbStopListLocal) {
    kmbStopList = JSON.parse(kmbStopListLocal);
  } else {
    axios
      .get("https://data.etabus.gov.hk/v1/transport/kmb/stop/")
      .then((response) => {
        kmbStopList = response.data.data;
        localStorage.setItem("kmbStopList", JSON.stringify(kmbStopList));
      });
  }

  return kmbStopList;
};
