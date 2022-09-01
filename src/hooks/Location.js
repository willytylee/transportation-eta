import { useState, useEffect } from "react";

export const useLocation = ({ time }) => {
  const [location, setLocation] = useState({
    lat: 0,
    lng: 0,
  });

  useEffect(() => {
    const intervalContent = async () => {
      const success = (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      };

      navigator.geolocation.getCurrentPosition(success);
    };
    intervalContent();
    const interval = setInterval(intervalContent, time);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return { location };
};
