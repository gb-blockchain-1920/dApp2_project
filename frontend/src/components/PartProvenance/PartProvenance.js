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

export const PartProvenance = ({ part }) => {
  const [partData, setPartData] = React.useState({});

  React.useState(() => {
    getPart(part).then(data => setPartData(data));
  }, []);

  return (
    <ExpansionPanel>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        {partData.description && (
          <React.Fragment>
            <Typography>{partData.description.id}</Typography>
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
  );
};
