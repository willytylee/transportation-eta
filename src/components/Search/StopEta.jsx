import { Eta } from "./RouteList/Eta";

export const StopEta = ({
  seq,
  stopObj: { name, stopId },
  routeObj,
  StopEtaRoot,
}) => (
  <StopEtaRoot>
    {seq && <div className="seq">{seq}.</div>}
    <div className="stop" title={stopId}>
      {name.zh}
    </div>
    <div className="etas">
      <Eta seq={seq} routeObj={routeObj} slice={2} />
    </div>
  </StopEtaRoot>
);
