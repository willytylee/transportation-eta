import {Buses} from './../components/Bus/Buses.js'
import {MTRs} from './../components/MTR/MTRs.js'

export const Willy = () => {
	return <>
		<div className="section">
	    <div>上班</div>
	    <Buses stop="紅磡山谷道" range={[1, 3]}/>
	  </div>
	  <div className="section">
	    <div>回家</div>
	    <Buses stop="九龍灣宏展街" range={[4, 5]}/>
	    <Buses stop="將軍澳隧道轉車站" range={[6, 7]}/>
	    <Buses stop="彩虹站" range={[8, 8]}/>
	  </div>
	  <div className="section">
	    <div>藍田</div>
	    <Buses stop="紅磡山谷道" range={[9, 11]}/>
	    <Buses stop="九龍灣國際展貿中心" range={[12, 14]}/>
	  </div>
	  <div className="section">
	    <div>西貢</div>
	    <Buses stop="北拱街" range={[15, 17]}/>
	    <Buses stop="鑽石山站" range={[18, 18]}/>
	  </div>
	  <div className="section">
	    <MTRs range={[1, 2]} />
	  </div>
	  <div className="section">
	    <Buses stop="Testing" range={[19, 20]}/>
	  </div>
  </>
}