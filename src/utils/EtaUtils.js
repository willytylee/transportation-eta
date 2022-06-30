import React from "react";
import moment from "moment";

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
