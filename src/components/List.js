import React, {useState, useEffect} from 'react';
import axios from 'axios';
import moment from 'moment';

export const List = (props) => {

	const {sectionData, routeNo} = props;

	let fullArray = [];

	sectionData.forEach((routeData, i) => {
		if (routeData.length === 0){
			fullArray.push({'route': routeNo[i],'eta': ''})
		}else{
			routeData.forEach((data, j) => {
				if (data.eta){
					fullArray.push({'route': routeNo[i],'eta': data.eta})
				}else{
					fullArray.push({'route': routeNo[i],'eta': ''})
				}
			})	
		}
	})


	fullArray.sort((a,b) => {
		if (a.eta <= b.eta){
			return -1;
		}else{
			return 1;
		}
	}).forEach((routeData, i) => {
		// console.log(fullArray);
		const {eta} = routeData;

		if (eta){
      if (moment(eta).diff(moment(), 'minutes') === 0 || moment(eta).diff(moment(), 'minutes') === -1){
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