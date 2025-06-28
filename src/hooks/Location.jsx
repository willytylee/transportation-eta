// This hook is to get the current location information.
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
  }, []);

  return { location };
};

export const useLocationOnce = () => {
  const [location, setLocation] = useState({
    lat: 0,
    lng: 0,
  });
  const [stop, setStop] = useState(false);

  useEffect(() => {
    const intervalContent = async () => {
      const success = (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setStop(true);
      };
      navigator.geolocation.getCurrentPosition(success);
    };

    const intervalID = setInterval(intervalContent, 1000);

    if (stop) {
      clearInterval(intervalID);
    }

    return () => {
      clearInterval(intervalID);
    };
  }, [location]);

  return { location };
};
