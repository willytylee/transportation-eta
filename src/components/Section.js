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
					result.push(res.data.data);
				}else{
					res1 = await axios.get(api.url[0])
					res2 = await axios.get(api.url[1])
					res = res1.data.data.concat(res2.data.data)
					res.sort((a,b) => {
						if (a.eta <= b.eta){
							return -1;
						}else{
							return 1;
						}
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