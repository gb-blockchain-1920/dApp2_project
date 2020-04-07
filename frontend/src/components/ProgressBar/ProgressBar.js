import React from "react";
import { Box, LinearProgress, Typography } from "@material-ui/core";
import "./ProgressBar.css";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";

export const ProgressBar = ({ start, end, current, label }) => {
  const [value, setValue] = React.useState(0);

  setTimeout(() => {
    setValue(Math.min(((current - start) / (end - start)) * 100, 100));
  }, 1000);

  return (
    <Box className="bar-container">
      <Box pr={2} className="bar-label">
        <Typography>{label}</Typography>
      </Box>
      <CheckCircleIcon
        color={value < 75 ? "primary" : "secondary"}
        fontSize="large"
      />
      <LinearProgress
        color={value < 75 ? "primary" : "secondary"}
        variant="determinate"
        value={value}
        classes={{ root: "bar-indicator" }}
      />
      {value < 95 ? (
        <ErrorOutlineIcon color="disabled" fontSize="large" />
      ) : (
        <ErrorIcon color="secondary" fontSize="large" />
      )}
    </Box>
  );
};

// "action","disabled","error","inherit","primary","secondary"
