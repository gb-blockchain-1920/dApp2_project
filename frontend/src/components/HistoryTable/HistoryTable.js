import React from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box
} from "@material-ui/core";
import "./HistoryTable.css";
import moment from "moment";
import { wordCapitalization } from "../../scripts/wordManipulation.js";

const processEntry = (val, key) => {
  if (key === "hours") {
    return val;
  }

  if (moment(val).isValid()) {
    return moment(val).format("D MMM YYYY");
  }

  if (!val) {
    return "--";
  }
  return wordCapitalization(val);
};

export const HistoryTable = ({ objArray, mapping, large=false }) => {
  return (
    <div>
      <Typography variant={large ? "h6" : "body"}>History:</Typography>
      <Box px={1} pb={1}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {Object.values(mapping).map(heading => (
                  <TableCell key={heading}>{heading}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {objArray.map((row, index) => (
                <TableRow key={index}>
                  {Object.keys(mapping).map(key => {
                    return (
                      <TableCell key={key}>
                        {processEntry(row[key], key)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
};
