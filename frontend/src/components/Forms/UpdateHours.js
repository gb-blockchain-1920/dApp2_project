import React from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText
} from "@material-ui/core";
import { TextInput } from "../TextInput/TextInput";
import "./styles.css";
import { callAPI } from "../../scripts/hyperledger.js";

export const UpdateHours = ({ popState, current, trigger }) => {
  const [data, setData] = React.useState({
    tailNumber: current.description.tailNumber,
    hours: ""
  });
  const [submitted, setSubmitted] = React.useState(false);
  const handleCancel = () => {
    setData({
      tailNumber: "",
      hours: ""
    });
    popState.set(false);
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    const res = await callAPI("flight", "POST", data);
    console.log(res);
    setSubmitted(false);
    trigger(res);
    if (res) {
      handleCancel();
    }
  };

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
          disabled={submitted}
        />
        <TextInput
          type="number"
          label="Flight Hours"
          value={data.hours}
          id="hours"
          onChange={handleChange}
          disabled={submitted}
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={handleCancel}
          color="primary"
          disabled={submitted}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          color="primary"
          disabled={data.hours <= 0 || Object.values(data).some(val => !val) || submitted}
        >
          Submit
        </Button>
      </DialogActions>
    </React.Fragment>
  );
};

export default UpdateHours;
