import { useState, useEffect } from "react";

export const useLocation = ({ interval }) => {
  const [location, setLocation] = useState({
    lat: 0,
    lng: 0,
  });

  useEffect(() => {
    if (interval > 0) {
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
      const intervalID = setInterval(intervalContent, interval);

      return () => {
        clearInterval(intervalID);
      };
    }

    const success = (position) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    };

    navigator.geolocation.getCurrentPosition(success);
  }, []);

  return { location };
};
