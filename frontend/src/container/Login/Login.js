import React from "react";
import "./Login.css";
import { LoginCard } from "../../components/LoginCard/LoginCard";
import { TextInput } from "../../components/TextInput/TextInput";
import { AutoCompleteText } from "../../components/AutoCompleteText/AutoCompleteText";

export const Login = () => {
  const [companies, setCompanies] = React.useState([]);
  const roles = ["Administrator", "Maintainer"];
  const [userPass, setUserPass] = React.useState({
    username: "",
    password: ""
  });

  const [newUser, setNewUser] = React.useState({
    username: "",
    password: "",
    verified: "",
    role: "",
    company: ""
  });
  const [validate, setValidate] = React.useState(false);

  React.useEffect(() => {
    setCompanies(["Delta", "Air Canada", "KLM"]);
  }, []);

  const loginHandle = () => {
    console.log("login click");
  };

  const registerHandle = () => {
    console.log("register click");
  };

  const onChangeUserPass = event => {
    const key = event.target.id;
    const value = event.target.value;
    setUserPass(prev => {
      return { ...prev, [key]: value };
    });
  };

  const onChangeNew = event => {
    const key = event.target.id.replace("New", "");
    const value = event.target.value;
    setNewUser(prev => {
      return { ...prev, [key]: value };
    });
  };

  const autocompleteOnChange = (event, handler, key, obj) => {
    let value = event.target.value;
    if (typeof value === "number") {
      value = event.target.innerText.toLowerCase();
    }
    handler(prev => {
      return { ...prev, [key]: value || ""};
    });
  }

  const validatePassword = () => {
    setValidate(newUser.password !== newUser.verified);
  };

  return (
    <div className="login-container">
      <LoginCard
        heading="User Login"
        onClick={loginHandle}
        disabled={!Object.values(userPass).every(val => !!val)}
        buttonText="Login"
      >
        <TextInput label="Username" onChange={onChangeUserPass} id="username" />
        <TextInput
          label="Password"
          type="password"
          onChange={onChangeUserPass}
          id="password"
        />
      </LoginCard>
      <LoginCard
        heading="Register New User"
        onClick={registerHandle}
        disabled={!Object.values(newUser).every(val => !!val)}
        buttonText="Register"
      >
        <TextInput label="Username" onChange={onChangeNew} id="usernameNew" />
        <TextInput
          label="Password"
          type="password"
          onChange={onChangeNew}
          id="passwordNew"
        />
        <TextInput
          label="Confirm password"
          type="password"
          onChange={event => {
            if (validate) {
              setValidate(false);
            }
            onChangeNew(event);
          }}
          id="verified"
          disabled={!newUser.password}
          onBlur={validatePassword}
          error={validate}
          helperText={validate ? "passwords do not match" : ""}
        />
        <AutoCompleteText
          options={roles}
          optionLabel={option => option}
          label="Role"
          onInputChange={event => {
            autocompleteOnChange(event, setNewUser, "role", roles)
          }}
        />
        <AutoCompleteText
          options={companies}
          optionLabel={option => option}
          label="Company"
          freeSolo={newUser.role === "administrator"}
          onInputChange={event => {
            autocompleteOnChange(event, setNewUser, "company", companies)
          }}
        />
      </LoginCard>
    </div>
  );
};

export default Login;
