export const routeMap = {
  AEL: "機場快線",
  TCL: "東涌線",
  TML: "屯馬線",
  TKL: "將軍澳線",
  EAL: "東鐵線",
  DRL: "迪士尼線",
  ISL: "港島線",
  KTL: "觀塘線",
  SIL: "南港島線",
  TWL: "荃灣線",
};

export const stationMap = {
  AWE: "博覽館",
  AIR: "機場",
  TSY: "青衣",
  KOW: "九龍",
  HOK: "香港",
  SUN: "欣澳",
  DIS: "迪士尼",
  SHS: "上水",
  FAN: "粉嶺",
  TWO: "太和",
  TAP: "大埔墟",
  UNI: "大學",
  FOT: "火炭",
  SHT: "沙田",
  TAW: "大圍",
  KOT: "九龍塘",
  MKK: "旺角東",
  HUH: "紅磡",
  EXC: "會展",
  ADM: "金鐘",
  CHW: "柴灣",
  HFC: "杏花邨",
  SKW: "筲箕灣",
  SWH: "西灣河",
  TAK: "太古",
  QUB: "鰂魚涌",
  NOP: "北角",
  FOH: "炮台山",
  TIH: "天后",
  CAB: "銅鑼灣",
  WAC: "灣仔",
  CEN: "中環",
  SHW: "上環",
  SYP: "西營盤",
  HKU: "香港大學",
  KET: "堅尼地城",
  TIK: "調景嶺",
  YAT: "油塘",
  LAT: "藍田",
  KWT: "觀塘",
  NTK: "牛頭角",
  KOB: "九龍灣",
  CHH: "彩虹",
  DIH: "鑽石山",
  WTS: "黃大仙",
  LOF: "樂富",
  SKM: "石硤尾",
  PRE: "太子",
  MOK: "旺角",
  YMT: "油麻地",
  HOM: "何文田",
  WHA: "黃埔",
  WKS: "烏溪沙",
  MOS: "馬鞍山",
  HEO: "恆安",
  TSH: "大水坑",
  SHM: "石門",
  CIO: "第一城",
  STW: "沙田圍",
  CKT: "車公廟",
  HIK: "顯徑",
  KAT: "啟德",
  SUW: "宋皇臺",
  TKW: "土瓜灣",
  ETS: "尖東",
  AUS: "柯士甸",
  NAC: "南昌",
  MEF: "美孚",
  TWW: "荃灣西",
  KSR: "錦上路",
  YUL: "元朗",
  LOP: "朗屏",
  TIS: "天水圍",
  SIH: "兆康",
  TUM: "屯門",
  TUC: "東涌",
  OLY: "奧運",
  POA: "寶琳",
  HAH: "坑口",
  TKO: "將軍澳",
  LHP: "康城",
  TSW: "荃灣",
  TWH: "大窩口",
  KWH: "葵興",
  KWF: "葵芳",
  CSW: "長沙灣",
  SSP: "深水埗",
  JOR: "佐敦",
  TST: "尖沙咀",
  OCP: "海洋公園",
  WCH: "黃竹坑",
  LET: "利東",
  SOH: "海怡半島",
};

export const mtrIconColor = {
  ".TML": {
    filter:
      "invert(12%) sepia(93%) saturate(6476%) hue-rotate(42deg) brightness(95%) contrast(104%)",
  },
  ".AEL": {
    filter:
      "invert(34%) sepia(74%) saturate(2374%) hue-rotate(159deg) brightness(86%) contrast(103%)",
  },
  ".DRL": {
    filter:
      "invert(65%) sepia(16%) saturate(6001%) hue-rotate(297deg) brightness(100%) contrast(85%)",
  },
  ".EAL": {
    filter:
      "invert(61%) sepia(77%) saturate(314%) hue-rotate(160deg) brightness(94%) contrast(93%)",
  },
  ".ISL": {
    filter:
      "invert(34%) sepia(85%) saturate(1179%) hue-rotate(177deg) brightness(86%) contrast(106%)",
  },
  ".KTL": {
    filter:
      "invert(40%) sepia(98%) saturate(1584%) hue-rotate(117deg) brightness(86%) contrast(101%)",
  },
  ".SIL": {
    filter:
      "invert(89%) sepia(80%) saturate(5922%) hue-rotate(3deg) brightness(83%) contrast(99%)",
  },
  ".TCL": {
    filter:
      "invert(71%) sepia(49%) saturate(2097%) hue-rotate(339deg) brightness(99%) contrast(92%)",
  },
  ".TKL": {
    filter:
      "invert(28%) sepia(26%) saturate(2271%) hue-rotate(249deg) brightness(96%) contrast(89%)",
  },
  ".TWL": {
    filter:
      "invert(34%) sepia(100%) saturate(7384%) hue-rotate(349deg) brightness(85%) contrast(116%)",
  },
};

export const mtrLineColor = {
  ".TML": {
    color: "#9c2e00",
    stroke: "#9c2e00",
  },
  ".AEL": {
    color: "#00888e",
    stroke: "#00888e",
  },
  ".DRL": {
    color: "#eb6ea5",
    stroke: "#eb6ea5",
  },
  ".EAL": {
    color: "#5eb7e8",
    stroke: "#5eb7e8",
  },
  ".ISL": {
    color: "#0075c3",
    stroke: "#0075c3",
  },
  ".KTL": {
    color: "#00a040",
    stroke: "#00a040",
  },
  ".SIL": {
    color: "#cbd401",
    stroke: "#cbd401",
  },
  ".TCL": {
    color: "#f3992d",
    stroke: "#f3992d",
  },
  ".TKL": {
    color: "#7e3c93",
    stroke: "#7e3c93",
  },
  ".TWL": {
    color: "#e70011",
    stroke: "#e70011",
  },
};

export const stationDestMap = {
  AEL: {
    up: ["AWE"],
    down: ["HOK"],
  },
  DRL: {
    up: ["DIS"],
    down: ["SUN"],
  },
  TML: {
    up: ["TUM"],
    down: ["WKS"],
  },
  TCL: {
    up: ["TUC"],
    down: ["HOK"],
  },
  TKL: {
    up: ["POA", "LHP"],
    down: ["NOP", "TIK"],
  },
  EAL: {
    up: ["LOW", "LMC"],
    down: ["ADM"],
  },
  ISL: {
    up: ["CHW"],
    down: ["KET"],
  },
  KTL: {
    up: ["TIK"],
    down: ["WHA"],
  },
  SIL: {
    up: ["ADM"],
    down: ["SOH"],
  },
  TWL: {
    up: ["CEN"],
    down: ["TSW"],
  },
};

export const etaExcluded = [];
