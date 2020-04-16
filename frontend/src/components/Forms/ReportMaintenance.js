import React from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText
} from "@material-ui/core";
import { TextInput } from "../TextInput/TextInput";
import "./styles.css";

export const ReportMaintenance = ({ popState, current }) => {
  const [data, setData] = React.useState({
    tailNumber: current.description.tailNumber,
    type: "",
    notes: ""
  });
  const handleCancel = () => {
    setData({
      tailNumber: "",
      type: "",
      notes: ""
    })
    popState.set(false);
  };

  const handleSubmit = () => {};

  const handleChange = event => {
    const eventInfo = event.target;
    console.log(event.target);
    setData(prev => {
      return { ...prev, [eventInfo.id]: eventInfo.value };
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
        <TextInput
          label="Maintenance Type"
          value={data.type}
          onChange={handleChange}
        />
        <TextInput
          label="Notes"
          id="notes"
          onChange={handleChange}
          value={data.notes}
        />
        <TextInput
          label="Parts Replaced - need to implement"
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </React.Fragment>
  );
};

export default ReportMaintenance;
