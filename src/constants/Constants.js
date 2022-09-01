import { mtrLineColor } from "./Mtr";

export const companyMap = {
  kmb: "九巴",
  ctb: "城巴",
  nwfb: "新巴",
  mtr: "港鐵",
  gmb: "小巴",
  nlb: "嶼巴",
};

export const companyColor = {
  ".kmb": {
    color: "#DD1E2F",
    stroke: "#DD1E2F",
  },
  ".nwfb": {
    color: "#857700",
    stroke: "#857700",
  },
  ".ctb": {
    color: "#6A42A7",
    stroke: "#6A42A7",
  },
  ".gmb": {
    color: "#1c7136",
    stroke: "#1c7136",
  },
  ".nlb": {
    color: "#106b78",
    stroke: "#106b78",
  },
  ".mtr": {
    color: "#767676",
    stroke: "#767676",
    ...mtrLineColor,
  },
};

export const coPriority = ["kmb", "nwfb", "ctb", "gmb", "mtr", "nlb"];

export const primaryColor = "#2f305c";

export const navbarDetail = {
  "/search": {
    title: "路線搜尋",
  },
  "/news": {
    title: "交通消息",
  },
  "/weather": {
    title: "天氣",
  },
  "/bookmark": {
    title: "書籤",
  },
  "/settings": {
    title: "設定",
  },
  "/settings/update": {
    title: "更新",
    prevPage: "/settings",
  },
  "/settings/personal": {
    title: "個人化設定",
    prevPage: "/settings",
  },
  "/settings/install": {
    title: "安裝到手機",
    prevPage: "/settings",
  },
  "/settings/about": {
    title: "關於",
    prevPage: "/settings",
  },
  "/settings/about/changeLog": {
    title: "最新功能",
    prevPage: "/settings/about",
  },
  "/settings/bookmarkModify": {
    title: "書籤設定",
    prevPage: "/settings",
  },
};

export const serviceDate = {
  31: "星期一至五",
  287: "星期一至五",
  415: "星期一至五",
  63: "星期一至六",
  319: "星期一至六",
  447: "星期一至六",
  416: "星期六至日",
  480: "星期六至日",
  266: "星期二至四",
  271: "星期一至四",
  272: "星期五",
  288: "星期六",
  320: "星期日及公眾假期",
  448: "星期日及公眾假期",
  511: "所有日子",
  111: "除星期三外",
};
