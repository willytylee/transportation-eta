import { useContext } from "react";
import { decompress as decompressJson } from "lzutf8-light";
import {
  Grid,
  IconButton,
  DialogTitle,
  styled,
  DialogContent,
} from "@mui/material/";
import { Close as CloseIcon } from "@mui/icons-material";
import { DbContext } from "../../context/DbContext";
import { companyColor } from "../../constants/Constants";

export const PreviewDialog = ({
  encodedData,
  handlePreviewDialogCloseBtnOnClick,
}) => {
  const { gStopList } = useContext(DbContext);

  const decodedData = JSON.parse(
    decompressJson(encodedData || "W10=", {
      // "W10=" = compressed []
      inputEncoding: "Base64",
    })
  );
  return (
    <PreviewDialogRoot>
      <DialogTitle>
        <Grid>
          <div className="title">預覽</div>
          <div className="rightBtnGroup">
            <IconButton onClick={handlePreviewDialogCloseBtnOnClick}>
              <CloseIcon />
            </IconButton>
          </div>
        </Grid>
      </DialogTitle>
      <DialogContent>
        {decodedData.map((category, i) => (
          <div key={i} className="category">
            <div className="title">{category.title}</div>
            {category.data.map((section, j) => (
              <div key={j} className="section">
                {section.map((routes, k) => (
                  <div key={k} className="routes">
                    <div className={`route ${routes.co}`}>{routes.route}</div>
                    <div className="stopId">
                      {gStopList[routes.stopId].name.zh}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </DialogContent>
    </PreviewDialogRoot>
  );
};

const PreviewDialogRoot = styled("div")({
  ".category": {
    margin: "12px 0",
    ".title": {
      marginBottom: "4px",
      fontSize: "14px",
    },
    ".section": {
      marginBottom: "8px",
      paddingLeft: "8px",
      ".routes": {
        display: "flex",
        alignItems: "center",
        ".route": {
          fontSize: "13px",
          flexBasis: "42px",
        },
        ".stopId": {
          fontSize: "12px",
        },
        ...companyColor,
      },
    },
  },
});
