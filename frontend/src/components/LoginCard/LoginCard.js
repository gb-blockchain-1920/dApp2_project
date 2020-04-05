import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Button,
  Box
} from "@material-ui/core";
import "./LoginCard.css";

export const LoginCard = ({
  heading,
  onClick,
  disabled,
  buttonText,
  children
}) => {
  return (
    <Box mt={6} mx={5} className="loginCard-container">
      <Card raised={true} className="loginCard-card">
        <CardHeader title={heading} className="loginCard-center" />
        <CardContent className="loginCard-content loginCard-center">{children}</CardContent>
        <CardActions className="loginCard-center">
          <Button
            fullWidth={true}
            variant="contained"
            color="primary"
            onClick={onClick}
            disabled={disabled}
          >
            {buttonText}
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default LoginCard;
