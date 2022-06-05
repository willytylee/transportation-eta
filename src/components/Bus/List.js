import axios from 'axios';
import moment from 'moment';

export const List = (props) => {

	const {sectionData} = props;

	let fullArray = [];

	sectionData.forEach((routeData, i) => {
		const {etas, route} = routeData
		
		if (etas.length === 0){
			fullArray.push({
				route,
				eta: ''})
		}else{
			etas.forEach((data, j) => {
				if (data.eta){
					fullArray.push({
						route,
						eta: data.eta})
				}else{
					fullArray.push({
						route,
						eta: ''})
				}
			})	
		}
	})

	fullArray.sort((a,b) => {
		if (a.eta === '' || a.eta === null){
			return 1;
		}
		if (b.eta === '' || b.eta === null){
			return -1
		}
		return moment(a.eta).diff(moment(b.eta), 'second');
	}).forEach((routeData, i) => {

	const {eta} = routeData;
		if (eta){
      if (moment(eta).diff(moment(), 'minutes') <= 0){
        fullArray[i].eta =  '準備埋站';
      }else{
        fullArray[i].eta =  `${moment(eta).diff(moment(), 'minutes')}分鐘`;
      }
    }else{
      fullArray[i].eta =  '沒有班次';
    }   
	})

	fullArray = fullArray.slice(0, 3)

	return (
		<>
			<table>
				<tbody>
					{fullArray.map((data, i) => {
						return (
							<tr key={i}>
								<td>{data?.route}</td>
								<td className="eta">{data?.eta}</td>
							</tr>
						)
					})}
				</tbody>
			</table>
    </>
   )
}