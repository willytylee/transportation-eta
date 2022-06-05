import {useState, useEffect} from 'react';
import axios from 'axios';
import moment from 'moment';
import {apis} from './../../APIs/busApis.js';
import {Table} from './Table.js';
import {List} from './List.js';

export const Buses = (props) => {

	const [sectionData, setSectionData] = useState([]);
	const [kmbStopList, setKmbStopList] = useState([]);
	const [view, setView] = useState('list');
	const {stop, range} = props;

  useEffect(() => {

		axios.get('https://data.etabus.gov.hk/v1/transport/kmb/stop/').then((response) => {
  		setKmbStopList(response)
  	})

    const interval = setInterval( async () => {

    	const result = [];

    	for (let i = range[0] - 1; i < range[1]; i++){
    		let res, res1 = [], res2 = [];
    		const api = apis[i];

    		if (api.url.length === 1){
    			let route;
    			const apiUrl = api.url[0]
    			const apiUrlArr = apiUrl.split("/")
    			const endPoint = apiUrlArr[2]

    			if (endPoint === 'data.etabus.gov.hk'){
    				route = apiUrlArr[8]
    			}else if (endPoint === 'rt.data.gov.hk'){
    				route = apiUrlArr[9]
    			}
    			
					res = await axios.get(apiUrl)
					if (api.seq){
						result.push({
							etas: res.data.data.filter(item => item.seq == api.seq), // Default we get the 1st stop insteam of last stop
							route: route
						}); 
					}else{
						result.push({
							etas: res.data.data,
							route: route
						})	
					}
				}else{

					let route
					const apiUrl = api.url[0]
    			const apiUrlArr = apiUrl.split("/")
    			const endPoint = apiUrlArr[2]

    			if (endPoint === 'data.etabus.gov.hk'){
    				route = apiUrlArr[8]
    			}else if (endPoint === 'rt.data.gov.hk'){
    				route = apiUrlArr[9]
    			}


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
					result.push({
						etas: res,
						route
					});
				}
    	}

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
					<List sectionData={sectionData} />
				:
					<Table sectionData={sectionData} />
			}
		</>
	)
}