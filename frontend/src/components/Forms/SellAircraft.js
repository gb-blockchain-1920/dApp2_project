import React from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText
} from "@material-ui/core";
import { TextInput } from "../TextInput/TextInput";
import "./styles.css";

export const SellAircraft = ({ popState, current }) => {
  const [data, setData] = React.useState({
    tailNumber: current.description.tailNumber,
    company: "",
  });
  const handleCancel = () => {
    setData({
      tailNumber: "",
      company: "",
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
          Sell the corresponding aircraft to another company.
        </DialogContentText>
        <TextInput
          label="Tail Number"
          id="tailNumber"
          value={data.tailNumber}
        />
        <TextInput
          label="Company"
          value={data.company}
          id="company"
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

export default SellAircraft;
