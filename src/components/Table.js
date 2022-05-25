import React, {useState, useEffect} from 'react';
import axios from 'axios';
import moment from 'moment';

export const Table = (props) => {

	const {sectionData, routeNo} = props;

	const result = [];

	sectionData.forEach((routeData, i) => {
		const etas = routeData.map((data, i) => data.eta)
		if (etas.length === 0){
			result[i] = ['沒有班次']
		}else{
			result[i] = etas.map(eta => {
	      if (eta){
	        if (moment(eta).diff(moment(), 'minutes') === 0 || moment(eta).diff(moment(), 'minutes') === -1){
	          return '準備埋站';
	        }else{
	          return `${moment(eta).diff(moment(), 'minutes')}分鐘`;
	        }
	      }else{
	        return '沒有班次';
	      }
	    })      
		}
	})

	return (
		<>
	    <table>
	      <tbody>
	        {result.map((routeEta, i) => {
            return (
              <tr key={i}>
                <td>
                	{routeNo[i]}
                </td>
                {routeEta.map((eta, j) => {
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