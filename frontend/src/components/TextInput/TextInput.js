import React from "react";
import { TextField, Box } from "@material-ui/core";
import "./TextInput.css";

export const TextInput = ({ ...props }) => {
  return (
    <Box my={1} className="boxWidth">
      <TextField {...props} variant="outlined" fullWidth={true}/>
    </Box>
  );
};
