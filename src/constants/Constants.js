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
    title: "收藏",
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
    title: "自訂收藏",
    prevPage: "/settings",
  },
};
