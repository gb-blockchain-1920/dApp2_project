import React from "react";
import {
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from "@material-ui/core";
import "./PartProvenance.css";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { getPart } from "../../scripts/hyperledger.js";
import { ProgressBar } from "../../components/ProgressBar/ProgressBar";

export const PartProvenance = ({ parts, refresh }) => {
  const [partData, setPartData] = React.useState([]);

  React.useEffect(() => {
    if (parts.join("") === "demoPart") {
      setPartData([
        {
          description: { id: "demoPart", name: "Offline demo part" },
          totalHours: 100,
          maximumHours: 3000,
          history: [{ tailNumber: "G-ZBJG" }]
        }
      ]);
    } else {
      getPart(parts.join(",")).then(data => setPartData(data));
    }
  }, [parts, refresh]);

  return (
    <React.Fragment>
      {partData.length > 0 && partData.map((partData, index) => (
        <ExpansionPanel key={index}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            {partData.description && (
              <React.Fragment>
                <div className="div-spacing"><Typography>{partData.description.id}</Typography></div>
                <Typography className="expansion-secondLabel">
                  {partData.description.name}
                </Typography>
              </React.Fragment>
            )}
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className="expansionPanel-center">
            {partData.history && (
              <ProgressBar
                start={0}
                end={partData.maximumHours}
                current={partData.totalHours}
                label={`Current Aircraft: ${partData.history[partData.history.length - 1].tailNumber}`}
              />
            )}
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </React.Fragment>
  );
};
