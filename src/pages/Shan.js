import { Buses } from "./../components/Bus/Buses.js";
import { MTRs } from "./../components/MTR/MTRs.js";

export const Shan = () => {
  return (
    <>
      <div className="section">
        <div>上班</div>
        <MTRs id={0} direction={["up"]} />
        <Buses range={[28, 33]} />
      </div>
      <div className="section">
        <div>回家</div>
        <Buses range={[21, 27]} />
      </div>
    </>
  );
};
