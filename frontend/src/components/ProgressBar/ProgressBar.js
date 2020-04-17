import React from "react";
import { Box, LinearProgress, Tooltip } from "@material-ui/core";
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
        {label}
      </Box>
      <Tooltip arrow={true} title={start}>
        <CheckCircleIcon
          color={value < 75 ? "primary" : "secondary"}
          fontSize="large"
        />
      </Tooltip>
      <Tooltip arrow={true} title={current}>
        <LinearProgress
          color={value < 75 ? "primary" : "secondary"}
          variant="determinate"
          value={value}
          classes={{ root: "bar-indicator" }}
        />
      </Tooltip>
      <Tooltip arrow={true} title={end}>
        {value < 95 ? (
          <ErrorOutlineIcon color="disabled" fontSize="large" />
        ) : (
          <ErrorIcon color="secondary" fontSize="large" />
        )}
      </Tooltip>
    </Box>
  );
};

// "action","disabled","error","inherit","primary","secondary"
