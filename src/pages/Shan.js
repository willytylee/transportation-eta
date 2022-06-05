import {Buses} from './../components/Bus/Buses.js'
import {MTRs} from './../components/MTR/MTRs.js'

export const Shan = () => {
	return <>
		<div className="section">
	    <div>回家</div>
	    <Buses stop="尖沙咀碼頭" range={[21, 26]}/>
	  </div>
	</>
}