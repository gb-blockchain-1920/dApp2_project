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

export const AssignMaintainer = ({ popState, current }) => {
  const [data, setData] = React.useState({
    tailNumber: current.description.tailNumber,
    company: current.owner.slice(-1)[0].company,
    username: ""
  });
  const handleCancel = () => {
    setData({
      tailNumber: "",
      company: "",
      username: ""
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
          Assign a maintainer to have access to the corresponding aircraft.
        </DialogContentText>
        <TextInput
          label="Tail Number"
          id="tailNumber"
          value={data.tailNumber}
        />
        <TextInput
          label="Company"
          value={wordCapitalization(data.company)}
        />
        <TextInput
          label="Maintainer Username"
          id="username"
          onChange={handleChange}
          value={data.username}
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

export default AssignMaintainer;
