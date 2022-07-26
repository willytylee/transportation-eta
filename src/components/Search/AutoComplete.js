import { useContext, useState, useMemo, useEffect } from "react";
import { companyMap } from "../../constants/Bus";
import { AppContext } from "../../context/AppContext";
import { getLocalStorage } from "../../Utils";

export const AutoComplete = ({ route }) => {
  const [autoCompleteList, setAutoCompleteList] = useState([]);
  const { dbVersion, updateCurrRoute } = useContext(AppContext);

  const gRouteList = useMemo(() => {
    return getLocalStorage("routeList");
  }, [dbVersion]);

  const handleItemOnClick = (e) => {
    updateCurrRoute(e);
  };

  useEffect(() => {
    if (route) {
      setAutoCompleteList(
        Object.keys(gRouteList)
          .map((e) => gRouteList[e])
          .filter((e) => {
            return (
              route === e.route.substring(0, route.length) &&
              (e.co.includes("kmb") ||
                e.co.includes("nwfb") ||
                e.co.includes("ctb"))
            );
          })
      );
    } else {
      setAutoCompleteList([]);
    }
  }, [route]);

  return (
    <div className="autoComplete">
      {autoCompleteList.map((e, i) => {
        return (
          <div key={i} className="item" onClick={() => handleItemOnClick(e)}>
            <div className="route">{e.route}</div>
            <div className="company">
              {e.co.map((e) => companyMap[e]).join("+")}{" "}
            </div>
            <div className="origDest">
              {e.orig.zh} → <span className="dest">{e.dest.zh}</span>
              <span className="special">
                {" "}
                {parseInt(e.serviceType, 10) !== 1 && "特別班次"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
