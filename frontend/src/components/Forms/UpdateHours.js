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
    hours: 0
  });
  const handleCancel = () => {
    setData({
      tailNumber: "",
      hours: 0
    });
    popState.set(false);
  };

  const handleSubmit = () => {};

  const handleChange = event => {
    const eventInfo = event.target;
    const output =
      Number(eventInfo.value) < 0 && eventInfo.value !== ""
        ? 0
        : eventInfo.value;
    setData(prev => {
      return { ...prev, [eventInfo.id]: output };
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

export default UpdateHours;
