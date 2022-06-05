import axios from 'axios';
import moment from 'moment';

export const Table = (props) => {

	const {sectionData} = props;

	const txts = [];
	const result = [];

	sectionData.forEach((routeData, i) => {
		let {etas, route} = routeData;
		etas = routeData.etas.map((data, i) => data.eta)
		
		if (etas.length === 0){
			txts[i] = ['沒有班次']
		}else{
			txts[i] = etas.map(eta => {
	      if (eta){
	        if (moment(eta).diff(moment(), 'minutes') <= 0){
	          return '準備埋站';
	        }else{
	          return `${moment(eta).diff(moment(), 'minutes')}分鐘`;
	        }
	      }else{
	        return '沒有班次';
	      }
	    })      
		}
		result.push({
			route,
			etas: txts[i]
		})
	})

	return (
		<>
	    <table>
	      <tbody>
	        {result.map((routeData, i) => {
            return (
              <tr key={i}>
                <td>
                	{routeData.route}
                </td>
                {routeData.etas.map((eta, j) => {
                  return (
                    <td key={j} className="eta">
                      {eta}
                    </td>
                  )
                })}
              </tr>
            )
	        })}
	      </tbody>
	    </table>
    </>
   )
}