import React from "react";
import {
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  CircularProgress
} from "@material-ui/core";
import "./PartProvenance.css";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { getPart } from "../../scripts/hyperledger.js";
import { ProgressBar } from "../../components/ProgressBar/ProgressBar";
import { HistoryTable } from "../../components/HistoryTable/HistoryTable";

export const PartProvenance = ({ parts, refresh }) => {
  const [partData, setPartData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (parts.join("") === "demoPart") {
      setPartData([
        {
          description: { id: "demoPart", name: "Offline demo part" },
          totalHours: 100,
          maximumHours: 3000,
          history: [
            {
              tailNumber: "G-ZBJG",
              hours: 100,
              onDate: new Date(),
              offDate: null
            }
          ]
        }
      ]);
    } else {
      setLoading(true);
      getPart(parts.join(",")).then(data => {
        setPartData(data);
        setLoading(false);
      });
    }
  }, [parts, refresh]);

  return (
    <React.Fragment>
      {loading && (
        <div className="part-loading-container">
          <CircularProgress />
        </div>
      )}
      {partData !== undefined &&
        partData.map((part, index) => (
          <ExpansionPanel key={index}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              {part.description && (
                <React.Fragment>
                  <div className="div-spacing">
                    <Typography>{part.description.id}</Typography>
                  </div>
                  <Typography className="expansion-secondLabel">
                    {part.description.name}
                  </Typography>
                </React.Fragment>
              )}
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className="expansionPanel-center">
              {part.history && (
                <React.Fragment>
                  <ProgressBar
                    start={0}
                    end={part.maximumHours}
                    current={part.totalHours}
                    label={`Current Aircraft: ${part.history[part.history.length - 1].tailNumber}`}
                  />
                  <HistoryTable
                    objArray={part.history}
                    mapping={{
                      tailNumber: "Aircraft",
                      hours: "Hours",
                      onDate: "On Date",
                      offDate: "Off Date"
                    }}
                  />
                </React.Fragment>
              )}
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ))}
    </React.Fragment>
  );
};
