import React from "react";
import "./Login.css";
import { LoginCard } from "../../components/LoginCard/LoginCard";
import { TextInput } from "../../components/TextInput/TextInput";
import { AutoCompleteText } from "../../components/AutoCompleteText/AutoCompleteText";
import { useHistory } from "react-router-dom";
import { registerUser } from "../../scripts/hyperledger.js"

export const Login = ({ companies }) => {
  const history = useHistory();
  const roles = ["Administrator", "Maintainer"];
  const [register, setRegister] = React.useState(false);
  const [userPass, setUserPass] = React.useState({
    username: "",
    password: "",
    role: "",
    company: ""
  });

  const [newUser, setNewUser] = React.useState({
    username: "",
    password: "",
    verified: "",
    role: "",
    company: ""
  });
  const [validate, setValidate] = React.useState(false);

  const loginHandle = async () => {
    console.log("login click");
    history.push("/aircraft");
  };

  const registerHandle = async () => {
    console.log("register click");
    const data = newUser;
    delete data.verified; // remove extra key value pair
    const res = await registerUser(data);
    console.log(res);
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
      return { ...prev, [key]: value || "" };
    });
  };

  const validatePassword = () => {
    setValidate(newUser.password !== newUser.verified);
  };

  const wordCapitalization = phrase => {
    return phrase
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="login-container">
      {register ? (
        <LoginCard
          heading="Register New User"
          onClick={registerHandle}
          disabled={!Object.values(newUser).every(val => !!val)}
          buttonText="Register"
          toggleClick={() => setRegister(!register)}
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
            optionLabel={wordCapitalization}
            label="Role"
            onInputChange={event => {
              autocompleteOnChange(event, setNewUser, "role", roles);
            }}
          />
          <AutoCompleteText
            options={companies.list}
            optionLabel={wordCapitalization}
            label="Company"
            freeSolo={newUser.role === "administrator"}
            onInputChange={event => {
              autocompleteOnChange(
                event,
                setNewUser,
                "company",
                companies.list
              );
            }}
          />
        </LoginCard>
      ) : (
        <LoginCard
          heading="User Login"
          onClick={loginHandle}
          disabled={!Object.values(userPass).every(val => !!val)}
          buttonText="Login"
          toggleClick={() => setRegister(!register)}
        >
          <TextInput
            label="Username"
            onChange={onChangeUserPass}
            id="username"
          />
          <TextInput
            label="Password"
            type="password"
            onChange={onChangeUserPass}
            id="password"
          />
          <AutoCompleteText
            options={roles}
            optionLabel={wordCapitalization}
            label="Role"
            onInputChange={event => {
              autocompleteOnChange(event, setUserPass, "role", roles);
            }}
          />
          <AutoCompleteText
            options={companies.list}
            optionLabel={wordCapitalization}
            label="Company"
            onInputChange={event => {
              autocompleteOnChange(event, setUserPass, "company", roles);
            }}
          />
        </LoginCard>
      )}
    </div>
  );
};

export default Login;
