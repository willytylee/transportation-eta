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
