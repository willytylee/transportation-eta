import React, {useState, useEffect} from 'react';
import axios from 'axios';
import moment from 'moment';
import {apis} from './../../APIs/mtrApis.js';
import {constDest} from './../../constants/MTRDests.js'


export const MTRs = (props) => {

	const {range} = props;
	const [sectionData, setSectionData] = useState([])

  useEffect(() => {

    const interval = setInterval( async () => {

    	const result = [], sectionData = []

    	for (let i = range[0] - 1; i < range[1]; i++){
    		const api = apis[i];
    		const url = new URL(api.url);
    		result.push({
    			'name': api.stop,
    			'lineSta': `${url.searchParams.get('line')}-${url.searchParams.get('sta')}`,
    			'data': await axios.get(api.url)
    		})
    	}

    	result.forEach(station => {
    		const etas = []
    		const {lineSta} = station
    		const stationData = station.data.data.data[lineSta]

    		sectionData.push({
    			'name': station['name'],
    			'down': {
  					dest: stationData.DOWN.length > 1 ? constDest[stationData.DOWN[0].dest] : '',
  					ttnts: stationData.DOWN.map(data => (data.ttnt == 0) ? "準備埋站" : `${data.ttnt}分鐘`),
  				},
    			'up': {
  					dest: stationData.UP.length > 1 ? constDest[stationData.UP[0].dest] : '',
  					ttnts: stationData.UP.map(data => (data.ttnt == 0) ? "準備埋站" : `${data.ttnt}分鐘`),
  				},
    		})
    	})

    	setSectionData(sectionData)

    }, 1000)

    return () => clearInterval(interval);

  }, []);


	return (
		<>
			{sectionData.map((station, i) => {
				return (
					<div className="section" key={i}>
						<div>{station.name}</div>
						{(!station.down.dest && !station.up.dest)?
								"已停站"
						: null
						}
						{(station.down.dest)?
							<>
								<div>終點站: {station.down.dest}</div>
								<div>距離到站時間: 
								{station.down.ttnts.map((ttnt, j) => (
									<span className="ttnt" key={j}>
										{ttnt} 
									</span>
								))}
								</div>
							</>
						:
							null
						}
						{(station.up.dest)?
							<>
								<div>終點站: {station.up.dest}</div>
								<div>距離到站時間: 
								{station.up.ttnts.map((ttnt, j) => (
									<span className="ttnt" key={j}>
										{ttnt}
									</span>
								))}
								</div>		
							</>
						:
							null
						}
						
					</div>
				)
			})}
		</>
	)
}