import React from "react";
import { TextField, Box } from "@material-ui/core";
import "./TextInput.css";

export const TextInput = ({ ...props }) => {
  return (
    <Box my={1}>
      <TextField {...props} variant="outlined" />
    </Box>
  );
};
