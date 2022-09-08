import ctb_kmb from "../assets/transports/ctb_kmb.png";
import ctb from "../assets/transports/ctb.png";
import gmb from "../assets/transports/gmb.png";
import kmb_nwfb from "../assets/transports/kmb_nwfb.png";
import kmb from "../assets/transports/kmb.png";
import nwfb from "../assets/transports/nwfb.png";
import mtr from "../assets/transports/mtr.png";

import { mtrLineColor } from "./Mtr";

export const companyMap = {
  kmb: "九巴",
  ctb: "城巴",
  nwfb: "新巴",
  mtr: "港鐵",
  gmb: "小巴",
  nlb: "嶼巴",
};

export const companyIconMap = {
  kmb,
  ctb,
  nwfb,
  ctb_kmb,
  kmb_nwfb,
  mtr,
  gmb,
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
  "/direction": {
    title: "規劃路線",
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
  "/settings/about/lab": {
    title: "實驗功能",
    prevPage: "/settings/about",
  },
  "/settings/bookmarkModify": {
    title: "書籤設定",
    prevPage: "/settings",
  },
};

export const serviceDate = {
  31: { string: "星期一至五", day: "12345" },
  287: { string: "星期一至五", day: "12345" },
  415: { string: "星期一至五", day: "12345" },
  63: { string: "星期一至六", day: "123456" },
  319: { string: "星期一至六", day: "123456" },
  447: { string: "星期一至六", day: "123456" },
  416: { string: "星期六至日", day: "67" },
  480: { string: "星期六至日", day: "67" },
  266: { string: "星期二至四", day: "234" },
  271: { string: "星期一至四", day: "1234" },
  272: { string: "星期五", day: "5" },
  288: { string: "星期六", day: "6" },
  320: { string: "星期日及公眾假期", day: "7" },
  448: { string: "星期日及公眾假期", day: "7" },
  511: { string: "所有日子", day: "1234567" },
  111: { string: "除星期三外", day: "124567" },
};
