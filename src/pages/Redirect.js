import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Redirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const defaultScreen =
      JSON.parse(localStorage.getItem("settings"))?.defaultScreen || "路線搜尋";

    switch (defaultScreen) {
      case "路線搜尋":
        navigate("/search", { replace: true });
        break;

      case "交通消息":
        navigate("/news", { replace: true });
        break;

      case "收藏":
        navigate("/bookmark", { replace: true });
        break;

      case "天氣":
        navigate("/weather", { replace: true });
        break;

      default:
        navigate("/search", { replace: true });
        break;
    }
  }, []);
};
