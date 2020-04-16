import React from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText
} from "@material-ui/core";
import { TextInput } from "../TextInput/TextInput";
import "./styles.css";
import { AutoCompleteText } from "../AutoCompleteText/AutoCompleteText";
import { wordCapitalization } from "../../scripts/wordManipulation.js";

export const SellAircraft = ({ popState, current, companies }) => {
  const [data, setData] = React.useState({
    tailNumber: current.description.tailNumber,
    company: ""
  });
  const handleCancel = () => {
    setData({
      tailNumber: "",
      company: ""
    });
    popState.set(false);
  };

  const companyList = companies.list.filter(
    company => company !== current.owner.slice(-1)[0].company
  );

  const handleSubmit = () => {};

  const autocompleteOnChange = (event, handler, key, obj) => {
    let value = event.target.value;
    // console.log(value);
    if (typeof value === "number") {
      value = event.target.innerText.toLowerCase();
    }
    handler(prev => {
      return { ...prev, [key]: value || "" };
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
        <AutoCompleteText
          options={companyList}
          optionLabel={wordCapitalization}
          label="Company"
          onInputChange={event => {
            autocompleteOnChange(event, setData, "company", companyList);
          }}
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

export default SellAircraft;
