import {useState, useEffect} from 'react';
import axios from 'axios';
import moment from 'moment';
import './App.css';
import {Buses} from './components/Bus/Buses.js'
import {MTRs} from './components/MTR/MTRs.js'

const App = () => {

  return (
    <>
      <div className="section">
        <div>上班</div>
        <Buses stop="紅磡山谷道 => 啟成街" range={[1, 3]}/>
      </div>
      <div className="section">
        <div>回家</div>
        <Buses stop="九龍灣宏展街 (公司) => 庇利街" range={[4, 5]}/>
        <Buses stop="將軍澳隧道轉車站 => 庇利街" range={[6, 7]}/>
      </div>
      <div className="section">
        <div>藍田</div>
        <Buses stop="紅磡山谷道 => 將軍澳隧道轉車站" range={[8, 10]}/>
        <Buses stop="九龍灣國際展貿中心 => 將軍澳隧道轉車站" range={[11, 13]}/>
      </div>
      <div className="section">
        <div>西貢</div>
        <Buses stop="北拱街 => 四美街" range={[14, 16]}/>
        <Buses stop="鑽石山站 => 黃石碼頭" range={[17, 17]}/>
      </div>
      <div className="section">
        <MTRs range={[1, 2]} />
      </div>
      <div className="section">
        <Buses stop="Testing" range={[18, 19]}/>
      </div>
    </>
  );
}

export default App;
