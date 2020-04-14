import React from "react";
import {
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@material-ui/core";
import "./MaintenanceRecordPanel.css";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { wordCapitalization } from "../../scripts/wordManipulation.js";
import moment from "moment";

export const MaintenanceRecordPanel = ({ report }) => {
  try {
    report.partsReplaced = JSON.parse(report.partsReplaced);
  } catch (e) {
    console.log(e);
  }
  console.log(report);
  return (
    <ExpansionPanel>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>{moment(report.date).format("D MMM YYYY")}</Typography>
        <Typography className="expansion-secondLabel">
          {`Maintenance Type: ${wordCapitalization(report.type)}`}
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className="expansionPanel-center">
        <Typography>{`Notes: ${report.notes}`}</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Original Part</TableCell>
                <TableCell>New Part</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(report.partsReplaced).map(key => {
                return (
                  <TableRow key={key}>
                    <TableCell>
                      {key.includes("newPart") ? "--" : key}
                    </TableCell>
                    <TableCell>{report.partsReplaced[key]}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};
