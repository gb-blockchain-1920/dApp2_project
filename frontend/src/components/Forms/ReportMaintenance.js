import React from "react";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextareaAutosize,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputBase
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { TextInput } from "../TextInput/TextInput";
import "./styles.css";
import { AutoCompleteText } from "../AutoCompleteText/AutoCompleteText";
import { wordCapitalization } from "../../scripts/wordManipulation.js";
const crypto = require("crypto");

export const ReportMaintenance = ({ popState, current }) => {
  const [data, setData] = React.useState({
    tailNumber: current.description.tailNumber,
    type: "",
    notes: ""
  });
  const types = ["general", "A", "B", "C", "D"];
  const [partData, setPartData] = React.useState({});

  React.useEffect(() => {
    let temp = {};
    current.partsList.forEach(part => {
      temp[part] = "";
    });
    updateParts(temp);
  }, [current.partsList]);

  const updateParts = data => {
    setPartData(prev => {
      return { ...prev, ...data };
    });
  };

  const newPart = () => {
    const id = crypto.randomBytes(5).toString("hex");
    const temp = { [`newPart${id}`]: "" };
    updateParts(temp);
  };

  const handleCancel = () => {
    setData({
      tailNumber: "",
      type: "",
      notes: ""
    });
    popState.set(false);
  };

  const handleSubmit = () => {};

  const handleChange = event => {
    const eventInfo = event.target;
    // console.log(event.target);
    setData(prev => {
      return { ...prev, [eventInfo.id]: eventInfo.value };
    });
  };

  const handlePartChange = event => {
    const eventInfo = event.target;
    updateParts({ [eventInfo.id]: eventInfo.value });
  };

  const autocompleteOnChange = (event, handler, key, obj) => {
    let value = event.target.value;
    // console.log(value);
    if (typeof value === "number") {
      value = event.target.innerText.toLowerCase();
    }
    handler(prev => {
      return { ...prev, [key]: value || "" };
    });
  };

  return (
    <React.Fragment>
      <DialogContent className="form-box">
        <DialogContentText>
          Input data for a maintenance report to be stored with the aircraft.
        </DialogContentText>
        <TextInput
          label="Tail Number"
          id="tailNumber"
          value={data.tailNumber}
        />
        <AutoCompleteText
          options={types}
          optionLabel={wordCapitalization}
          label="Maintenance Type"
          onInputChange={event => {
            autocompleteOnChange(event, setData, "type", types);
          }}
        />
        <TextareaAutosize
          placeholder="Notes"
          rowsMin={5}
          rowsMax={5}
          id="notes"
          onChange={handleChange}
          className="textArea"
        />
        <Box my={1} className="textArea">
          <TableContainer className="table-container">
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Current Part ID</TableCell>
                  <TableCell>New Part ID</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(partData).map(oldPart => (
                  <TableRow key={oldPart}>
                    <TableCell>
                      {oldPart.includes("newPart") ? "--" : oldPart}
                    </TableCell>
                    <TableCell>
                      <Box className="part-input-box">
                        <InputBase
                          placeholder="Part ID"
                          id={oldPart}
                          value={partData[oldPart]}
                          onChange={handlePartChange}
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Button variant="outlined" onClick={newPart} startIcon={<AddIcon />}>
          Add Item
        </Button>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          color="primary"
          disabled={Object.values(data).some(val => !val)}
        >
          Submit
        </Button>
      </DialogActions>
    </React.Fragment>
  );
};

export default ReportMaintenance;
