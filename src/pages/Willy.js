import { Buses } from "./../components/Bus/Buses.js";
import { MTRs } from "./../components/MTR/MTRs.js";

export const Willy = () => {
  return (
    <>
      <div className="section">
        <div>上班</div>
        <Buses range={[1, 3]} />
      </div>
      <div className="section">
        <div>回家</div>
        <Buses range={[4, 5]} />
        <Buses range={[6, 7]} />
        <Buses range={[8, 8]} />
      </div>
      <div className="section">
        <div>藍田</div>
        <Buses range={[12, 14]} />
        <Buses range={[9, 11]} />
      </div>
      <div className="section">
        <div>西貢</div>
        <Buses range={[15, 17]} />
        <Buses range={[18, 18]} />
      </div>
      <div className="section">
        <MTRs id={0} direction={["up", "down"]} />
      </div>
      <div className="section">
        <MTRs id={1} direction={["up", "down"]} />
      </div>
      <div className="section">
        <Buses range={[19, 20]} />
      </div>
    </>
  );
};
