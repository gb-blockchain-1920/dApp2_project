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
    <Box mt={6} mx={5}>
      <Card raised={true} className="card">
        <CardHeader title={heading} className="center" />
        <CardContent className="content center">{children}</CardContent>
        <CardActions className="center">
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
