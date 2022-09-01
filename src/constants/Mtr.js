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
  DIS: "迪士尼",
  HOK: "香港",
  KOW: "九龍",
  AIR: "機場",
  AWE: "博覽館",
  OLY: "奧運",
  LAK: "麗景",
  TSY: "青衣",
  SUN: "欣澳",
  TUC: "東涌",
  WKS: "烏溪沙",
  MOS: "馬鞍山",
  HEO: "恆安",
  TSH: "大水坑",
  SHM: "石門",
  CIO: "第一城",
  STW: "沙田圍",
  CKT: "車公廟",
  TAW: "大圍",
  HIK: "顯徑",
  DIH: "鑽石山",
  KAT: "啟德",
  SUW: "宋皇台",
  TKW: "土瓜灣",
  HOM: "何文田",
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
  NOP: "北角",
  QUB: "鰂魚涌",
  YAT: "油塘",
  TIK: "調景嶺",
  TKO: "將軍澳",
  LHP: "日出康城",
  HAH: "坑口",
  POA: "寶琳",
  ADM: "金鐘",
  EXC: "會展",
  HUH: "紅磡",
  MKK: "旺角東",
  KOT: "九龍塘",
  SHT: "沙田",
  FOT: "火炭",
  RAC: "馬場",
  UNI: "大學",
  TAP: "大埔墟",
  TWO: "太和",
  FAN: "粉嶺",
  SHS: "上水",
  LOW: "羅湖",
  LMC: "落馬洲",
  TSW: "荃灣",
  CEN: "中環",
  SOH: "海怡半島",
  WHA: "黃埔",
  KET: "堅尼地城",
  CHW: "柴灣",
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

export const etaExcluded = ["DRL", "ISL", "KTL", "SIL", "TWL"];
