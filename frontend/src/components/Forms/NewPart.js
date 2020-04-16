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

export const NewPart = ({ popState, current, trigger }) => {
  const [data, setData] = React.useState({
    id: "",
    name: "",
    maximumHours: ""
  });
  const [submitted, setSubmitted] = React.useState(false);

  const handleCancel = () => {
    setData({
      id: "",
      name: "",
      maximumHours: ""
    });
    popState.set(false);
  };

  const handleSubmit = async () => {
    const obj = {
      description: { id: data.id, name:data.name },
      maximumHours: data.maximumHours
    };
    setSubmitted(true);
    const res = await callAPI("part", "POST", obj);
    console.log(res);
    setSubmitted(false);
    trigger(res);
    if (res) {
      handleCancel();
    }
  };

  const handleChange = event => {
    const eventInfo = event.target;
    eventInfo.value =
      eventInfo.id === "maximumHours" &&
      Number(eventInfo.value) < 0 &&
      eventInfo.value !== ""
        ? 0
        : eventInfo.value;
    setData(prev => {
      return { ...prev, [eventInfo.id]: eventInfo.value };
    });
  };

  return (
    <React.Fragment>
      <DialogContent className="form-box">
        <DialogContentText>
          Register a new part to be tracked in the Hyperledger Fabric blockchain
          network.
        </DialogContentText>
        <TextInput
          label="Part ID"
          id="id"
          value={data.id}
          onChange={handleChange}
          disabled={submitted}
        />
        <TextInput
          label="Short Description"
          id="name"
          value={data.name}
          onChange={handleChange}
          disabled={submitted}
        />
        <TextInput
          type="number"
          label="Maximum Flight Hours"
          value={data.maximumHours}
          id="maximumHours"
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
          disabled={
            data.maximumHours <= 0 ||
            Object.values(data).some(val => !val) ||
            submitted
          }
        >
          Submit
        </Button>
      </DialogActions>
    </React.Fragment>
  );
};

export default NewPart;
