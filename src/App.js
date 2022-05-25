import React, {useState, useEffect} from 'react';
import axios from 'axios';
import moment from 'moment';
import './App.css';
import {apis} from './apis.js';
import {Section} from './components/Section.js'

const App = () => {

  return (
    <div className="App">
      <div className="section">
        <div>上班</div>
        <Section stop="紅磡山谷道 => 啟成街"  range={[1, 3]}/>
      </div>
      <div className="section">
        <div>回家</div>
        <Section stop="九龍灣宏展街 => 庇利街"  range={[4, 5]}/>
        <Section stop="將軍澳隧道轉車站 => 庇利街"  range={[6, 7]}/>
      </div>
      <div className="section">
        <div>藍田</div>
        <Section stop="紅磡山谷道 => 將軍澳隧道轉車站"  range={[8, 10]}/>
        <Section stop="九龍灣國際展貿中心 => 將軍澳隧道轉車站"  range={[11, 13]}/>
      </div>
      <div className="section">
        <div>西貢</div>
        <Section stop="北拱街 => 四美街"  range={[14, 16]}/>
        <Section stop="鑽石山站 => 黃石碼頭"  range={[17, 17]}/>
      </div>
      <div className="section">
        <Section stop="Testing"  range={[18, 19]}/>
      </div>
    </div>
  );
}

export default App;
