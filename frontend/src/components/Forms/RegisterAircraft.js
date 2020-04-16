import React from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText
} from "@material-ui/core";
import { TextInput } from "../TextInput/TextInput";
import "./styles.css";
import { wordCapitalization } from "../../scripts/wordManipulation";

export const RegisterAircraft = ({ popState, current }) => {
  const [data, setData] = React.useState({
    aircraft: "",
    tailNumber: "",
    company: current.owner.slice(-1)[0].company,
    image: ""
  });
  const handleCancel = () => {
    setData({
      aircraft: "",
      tailNumber: "",
      company: "",
      image: ""
    });
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
          Register a new aircraft to be tracked in the Hyperledger Fabric
          blockchain network.
        </DialogContentText>
        <TextInput
          label="Aircraft Name"
          id="aircraft"
          onChange={handleChange}
          value={data.aircraft}
        />
        <TextInput
          label="Tail Number"
          id="tailNumber"
          onChange={handleChange}
          value={data.tailNumber}
        />
        <TextInput label="Company" value={wordCapitalization(data.company)} />
        <TextInput
          label="Image URL"
          id="image"
          onChange={handleChange}
          value={data.image}
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

export default RegisterAircraft;
