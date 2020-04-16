import React from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText
} from "@material-ui/core";
import { TextInput } from "../TextInput/TextInput";
import "./styles.css";

export const UpdateHours = ({ popState, current }) => {
  const [data, setData] = React.useState({
    tailNumber: current.description.tailNumber,
    hours: 0,
  });
  const handleCancel = () => {
    setData({
      tailNumber: "",
      hours: 0,
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
          Update the flight hours for an aircraft and its corresponding parts.
        </DialogContentText>
        <TextInput
          label="Tail Number"
          id="tailNumber"
          value={data.tailNumber}
        />
        <TextInput
          type="number"
          label="Flight Hours"
          value={data.hours}
          id="hours"
          onChange={handleChange}
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

export default UpdateHours;
