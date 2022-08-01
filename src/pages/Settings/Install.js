import { useState } from "react";
import {
  styled,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  IosShare as IosShareIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import install1Png from "../../assets/install/install1.png";
import install3Png from "../../assets/install/install3.png";
import install4Png from "../../assets/install/install4.png";

export const Install = () => {
  const [accoExpanded, setAccoExpanded] = useState(false);

  const handleAccoChange = (panel) => (event, isExpanded) => {
    setAccoExpanded(isExpanded ? panel : false);
  };

  return (
    <InstallRoot>
      <div className="title">安裝到手機:</div>
      <div className="subTitle">IOS</div>
      <Accordion
        expanded={accoExpanded === "panel1"}
        onChange={handleAccoChange("panel1")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          使用定位服務
        </AccordionSummary>
        <AccordionDetails>
          <div>
            1. 設定 → 私隱 → 定位服務 → Safari網站 → 允許取用位置
            <br />
            設定為「使用App時」
          </div>
          <div>
            <img src={install1Png} alt="install1Png" />
          </div>
          <DividerRoot />
          <div>2. 使用Safari瀏覽此網頁</div>
          <DividerRoot />
          <div>3. 在網址列按「大小」</div>
          <div>
            <img src={install3Png} alt="install3Png" />
          </div>
          <div>→ 網頁設定 → 位置 → 允許</div>
          <div>
            <img src={install4Png} alt="install4Png" />
          </div>
          <DividerRoot />
          <div>
            4. 按分享
            <IosShareIcon className="iosShareIcon" />
            圖示
          </div>
          <DividerRoot />
          <div>5. 加至主畫面</div>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={accoExpanded === "panel2"}
        onChange={handleAccoChange("panel2")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          不使用定位服務
        </AccordionSummary>
        <AccordionDetails>
          <div>1. 使用Safari瀏覽此網頁</div>
          <DividerRoot />
          <div>
            2. 按分享
            <IosShareIcon className="iosShareIcon" />
            圖示
          </div>
          <DividerRoot />
          <div>3. 加至主畫面</div>
        </AccordionDetails>
      </Accordion>
    </InstallRoot>
  );
};

const InstallRoot = styled("div")({
  padding: "14px",
  overflow: "auto",
  div: {
    marginBottom: "4px",
  },
  ".title": {
    fontSize: "18px",
    fontWeight: "900",
    marginBottom: "8px",
  },
  ".subTitle": {
    fontSize: "16px",
  },
  ".iosShareIcon": {
    fontSize: "18px",
  },
  img: {
    width: "80%",
    maxWidth: "370px",
  },
  ".install2png": {
    width: "40%",
  },
});

const DividerRoot = styled(Divider)({
  margin: "8px 0",
});
