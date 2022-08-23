import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { PersonalEta } from "../components/PersonalEta/PersonalEta";
// import { AppContext } from "../context/AppContext";

export const Bookmark = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const userId = JSON.parse(localStorage.getItem("user"))?.userId || null;

  useEffect(() => {
    if (!userId) {
      enqueueSnackbar("請選擇用戶", {
        variant: "warning",
      });
      navigate("/settings", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return <PersonalEta userId={userId} />;
};
