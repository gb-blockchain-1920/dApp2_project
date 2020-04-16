import React from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText
} from "@material-ui/core";
import { TextInput } from "../TextInput/TextInput";
import "./styles.css";

export const NewPart = ({ popState, current }) => {
  const [data, setData] = React.useState({
    id: "",
    name: "",
    maximumHours: 0
  });
  const handleCancel = () => {
    setData({
      id: "",
      name: "",
      maximumHours: 0
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
          Register a new part to be tracked in the Hyperledger Fabric
          blockchain network.
        </DialogContentText>
        <TextInput
          label="Part ID"
          id="id"
          value={data.id}
          onChange={handleChange}
        />
        <TextInput
          label="Short Description"
          id="name"
          value={data.name}
          onChange={handleChange}
        />
        <TextInput
          type="number"
          label="Maximum Flight Hours"
          value={data.maximumHours}
          id="maximumHours"
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

export default NewPart;
