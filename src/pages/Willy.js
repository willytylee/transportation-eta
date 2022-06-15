import { useParams } from "react-router-dom";
import { Buses } from "./../components/Bus/Buses.js";
import { MTRs } from "./../components/MTR/MTRs.js";
import { data } from "./../data/Willy.js";

export const Willy = () => {
  const { name } = useParams();
  console.log(name);
  return (
    <>
      {data.map((category, i) => {
        return (
          <div key={i}>
            <div className="section">
              <div>{category.title}</div>
              {category.data.map((section, j) => {
                const firstUrl = section[0].url[0];
                if (firstUrl.includes("citybus") || firstUrl.includes("kmb")) {
                  return <Buses key={j} section={section} />;
                } else {
                  return (
                    <MTRs
                      key={j}
                      direction={["up", "down"]}
                      section={section}
                    />
                  );
                }
              })}
            </div>
          </div>
        );
      })}
    </>
  );
};
