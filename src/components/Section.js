import React, {useState, useEffect} from 'react';
import axios from 'axios';
import moment from 'moment';
import {apis} from './../apis.js';
import {Table} from './Table.js';
import {List} from './List.js';

export const Section = (props) => {

	const [sectionData, setSectionData] = useState([]);
	const [routeNo, setRouteNo] = useState([]);
	const [view, setView] = useState('list');
	const {stop, range} = props;

  useEffect(() => {

    const interval = setInterval( async () => {

    	const result = [], routeNo = [];

    	for (let i = range[0] - 1; i < range[1]; i++){
    		let res, res1 = [], res2 = [];
    		const api = apis[i];

    		routeNo.push(api.route);

    		if (api.url.length === 1){
					res = await axios.get(api.url[0])
					if (api.seq){
						result.push(res.data.data.filter(item => item.seq == api.seq)); // Default we get the 1st stop insteam of last stop
					}else{
						result.push(res.data.data)	
					}
				}else{
					res1 = await axios.get(api.url[0])
					res2 = await axios.get(api.url[1])

					if (api.seq){
						const data1 = res1.data.data.filter(item => item.seq == 1)
						const data2 = res2.data.data.filter(item => item.seq == 1)
						res = data1.concat(data2)
					}else{
						res = res1.data.data.concat(res2.data.data);
					}
					
					res.sort((a,b) => {
						if (a.eta === '' || a.eta === null){
							return 1;
						}
						if (b.eta === '' || b.eta === null){
							return -1
						}
						return moment(a.eta).diff(moment(b.eta), 'second');
					})

					res = res.slice(0, 3)
					result.push(res);
				}
    	}

    	setRouteNo(routeNo)
  		setSectionData(result);  

    }, 1000)

    return () => clearInterval(interval);

  }, []);

  const switchView = () => {
  	if (view === 'list'){
  		setView('table');
  	}else if (view === 'table'){
  		setView('list');
  	}
  }

	return (
		<>
			<div>{stop} <button onClick={() => switchView(view)}>{view === 'list'?'Table':'List'} view</button></div>
			{
				view === 'list'?
					<List sectionData={sectionData} routeNo={routeNo} />
				:
					<Table sectionData={sectionData} routeNo={routeNo} />
			}
		</>
	)
}