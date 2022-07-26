import React, { useState, useEffect, useContext, useMemo } from "react";
import { login } from "../../fetch/FatherHoliday";

export const FatherHolidays = () => {
  useEffect(() => {
    login();
  }, []);
  return <div>FatherHolidays</div>;
};
