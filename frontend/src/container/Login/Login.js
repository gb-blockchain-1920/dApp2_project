import React from "react";
import "./Login.css";
import { LoginCard } from "../../components/LoginCard/LoginCard";
import { TextInput } from "../../components/TextInput/TextInput";

export const Login = () => {
  const loginHandle = () => {
    console.log("login click");
  };

  const registerHandle = () => {
    console.log("register click");
  };

  return (
    <div className="container">
      <LoginCard
        heading="User Login"
        onClick={loginHandle}
        disabled={false}
        buttonText="Login"
      >
        <TextInput label="Username" />
        <TextInput label="Password" type="password" />
      </LoginCard>
      <LoginCard
        heading="Register New User"
        onClick={registerHandle}
        disabled={false}
        buttonText="Register"
      >
        <TextInput label="Username"/>
        <TextInput label="Password" type="password" />
        <TextInput label="Confirm password" type="password" />
        <TextInput label="Role" />
        <TextInput label="Company" />
      </LoginCard>
    </div>
  );
};

export default Login;
