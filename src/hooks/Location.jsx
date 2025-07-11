// This hook is to get the current location information.
import { useState, useEffect } from "react";

export const useLocation = ({ interval }) => {
  const [location, setLocation] = useState({
    lat: 0,
    lng: 0,
  });

  useEffect(() => {
    if (interval > 0) {
      // Watch for position changes
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({ lat: latitude, lng: longitude });
        },
        () => {},
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );

      // Cleanup on component unmount
      return () => navigator.geolocation.clearWatch(watchId);

      // const intervalContent = async () => {
      //   const success = (position) => {
      //     setLocation({
      //       lat: position.coords.latitude,
      //       lng: position.coords.longitude,
      //     });
      //   };

      //   navigator.geolocation.getCurrentPosition(success);
      // };
      // intervalContent();
      // const intervalID = setInterval(intervalContent, interval);

      // return () => {
      //   clearInterval(intervalID);
      // };
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
