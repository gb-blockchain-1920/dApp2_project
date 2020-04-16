import React from "react";
import { Dialog, DialogTitle } from "@material-ui/core";

export const PopUp = ({ popState, title, children }) => {
  const handleClose = () => {
    popState.set(false);
  };

  return (
    <Dialog
      open={popState.open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      {children}
    </Dialog>
  );
};

export default PopUp;
