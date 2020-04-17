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
import { AutoCompleteText } from "../AutoCompleteText/AutoCompleteText";
import { callAPI, getMaintainers } from "../../scripts/hyperledger.js";

export const AssignMaintainer = ({ popState, current, trigger }) => {
  const [data, setData] = React.useState({
    tailNumber: current.description.tailNumber,
    company: current.owner.slice(-1)[0].company,
    username: ""
  });
  const [maintainers, setMaintainers] = React.useState([]);
  const [submitted, setSubmitted] = React.useState(false);

  React.useEffect(() => {
    getMaintainers().then(res => setMaintainers(res));
  }, []);

  const handleCancel = () => {
    setData({
      tailNumber: "",
      company: "",
      username: ""
    });
    popState.set(false);
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    const res = await callAPI("admin", "POST", data);
    console.log(res);
    setSubmitted(false);
    trigger(res);
    if (res) {
      handleCancel();
    }
  };

  const autocompleteOnChange = (event, handler, key, obj) => {
    let value = event.target.value;
    // console.log(value);
    if (typeof value === "number") {
      value = event.target.innerText;
    }
    handler(prev => {
      return { ...prev, [key]: value || "" };
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
          disabled={submitted}
        />
        <TextInput
          label="Company"
          value={wordCapitalization(data.company)}
          disabled={submitted}
        />
        <AutoCompleteText
          options={maintainers}
          optionLabel={maintainer => maintainer}
          label="Maintainer Username"
          onInputChange={event => {
            autocompleteOnChange(event, setData, "username", maintainers);
          }}
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
          disabled={Object.values(data).some(val => !val) || submitted}
        >
          Submit
        </Button>
      </DialogActions>
    </React.Fragment>
  );
};

export default AssignMaintainer;
