import { useContext } from "react";
import { decompress as decompressJson } from "lzutf8-light";
import { Grid, IconButton, DialogTitle, styled, DialogContent } from "@mui/material/";
import { Close as CloseIcon, ArrowBackIosNew as ArrowBackIosNewIcon } from "@mui/icons-material";
import { DbContext } from "../../context/DbContext";
import { companyColor } from "../../constants/Constants";

export const PreviewDialog = ({ data, setImportExportMode, previewFrom }) => {
  const { gStopList } = useContext(DbContext);

  const handleBackBtnOnClick = () => {
    setImportExportMode(previewFrom);
  };

  const decodedData = JSON.parse(
    decompressJson(data, {
      inputEncoding: "Base64",
    })
  );

  return (
    <PreviewDialogRoot>
      <DialogTitle>
        <Grid>
          <div className="title">預覽</div>
          <div className="leftBtnGroup">
            <IconButton onClick={handleBackBtnOnClick}>
              <ArrowBackIosNewIcon />
            </IconButton>
          </div>
          <div className="rightBtnGroup">
            <IconButton onClick={handleBackBtnOnClick}>
              <CloseIcon />
            </IconButton>
          </div>
        </Grid>
      </DialogTitle>
      <DialogContent>
        {decodedData?.length > 0 ? (
          decodedData.map((category, i) => (
            <div key={i} className="category">
              <div className="title">{category.title}</div>
              {category.data.map((section, j) => (
                <div key={j} className="section">
                  {section.map((routes, k) => (
                    <div key={k} className="routes">
                      <div className={`route ${routes.co}`}>{routes.route}</div>
                      <div className="stopId">{gStopList[routes.stopId].name.zh}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="emptyMsg">沒有書籤</div>
        )}
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
  ".emptyMsg": {
    fontSize: "14px",
    textAlign: "center",
    padding: "14px",
  },
});
