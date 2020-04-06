import React from "react";
import { TextInput } from "../TextInput/TextInput";
import { Autocomplete } from "@material-ui/lab";
import "./AutoCompleteText.css"

export const AutoCompleteText = ({
  options,
  optionLabel,
  freeSolo = false,
  onInputChange,
  id,
  ...props
}) => {
  return (
    <Autocomplete
      options={options}
      getOptionLabel={optionLabel}
      freeSolo={freeSolo}
      onInputChange={onInputChange}
      className="autoCompleteContainer"
      renderInput={params => <TextInput {...params} {...props} />}
    />
  );
};
