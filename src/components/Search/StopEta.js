import { Eta } from "./RouteList/Eta";

export const StopEta = ({
  seq,
  stopObj: { name, stopId },
  routeObj,
  StopEtaRoot,
}) => (
  <StopEtaRoot>
    <div className="seq">{seq}.</div>
    <div className="stop">{name.zh}</div>
    <div className="etas">
      <Eta seq={seq} routeObj={routeObj} slice={3} />
    </div>
  </StopEtaRoot>
);
