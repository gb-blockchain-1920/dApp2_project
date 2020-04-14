import React from "react";
import "./Login.css";
import { LoginCard } from "../../components/LoginCard/LoginCard";
import { TextInput } from "../../components/TextInput/TextInput";
import { AutoCompleteText } from "../../components/AutoCompleteText/AutoCompleteText";
import { useHistory } from "react-router-dom";
import { getUser } from "../../scripts/hyperledger.js";
import { wordCapitalization } from "../../scripts/wordManipulation.js"

export const Login = ({ connected, companies, userData }) => {
  const history = useHistory();
  const types = ["Administrator", "Maintainer"];
  const [register, setRegister] = React.useState(false);
  const [userPass, setUserPass] = React.useState({
    username: "",
    password: "",
    type: "",
    company: ""
  });
  const [validatedPass, setValidatedPass] = React.useState("");
  const [validate, setValidate] = React.useState(false);
  const [apiCalled, setAPIcalled] = React.useState(false);

  React.useEffect(() => {
    setValidate(!!validatedPass && userPass.password !== validatedPass);
  }, [userPass.password, validatedPass]);

  const loginHandle = async () => {
    console.log("login click");
    const data = userPass;
    delete data.verified; // remove extra key value pair
    const res = connected ? await getUser("login", data) : true;
    console.log(res);
    if (!res) {
      //error logging in
    } else {
      userData.setInfo(res.user || {offline: true});
      window.sessionStorage.setItem("jwt", res.jwtToken)
      history.push("/aircraft");
    }
  };

  const registerHandle = async () => {
    console.log("register click");
    setAPIcalled(true);
    const data = userPass;
    delete data.verified; // remove extra key value pair
    const res = connected ? await getUser("register", data) : true;
    setAPIcalled(false);
    console.log(res);

    if (res) {
      loginHandle();
    } else {
      //error registering
    }
  };

  const onChangeUserPass = event => {
    const key = event.target.id;
    const value = event.target.value;
    setUserPass(prev => {
      return { ...prev, [key]: value };
    });
  };

  const autocompleteOnChange = (event, handler, key, obj) => {
    let value = event.target.value;
    // console.log(value);
    if (typeof value === "number") {
      value = event.target.innerText.toLowerCase();
    }
    handler(prev => {
      return { ...prev, [key]: value || "" };
    });
  };

  return (
    <div className="login-container">
      <LoginCard
        heading={register ? "Register User" : "User Login"}
        switchText={
          register ? "Existing users sign in" : "New users register here"
        }
        onClick={register ? registerHandle : loginHandle}
        disabled={
          !Object.values(userPass).every(val => !!val) ||
          apiCalled ||
          validate ||
          (register && !validatedPass)
        }
        buttonText={register ? "Register" : "Login"}
        toggleClick={() => setRegister(!register)}
      >
        <TextInput
          label="Username"
          onChange={onChangeUserPass}
          id="username"
          value={userPass.username}
        />
        <TextInput
          label="Password"
          type="password"
          onChange={onChangeUserPass}
          id="password"
          value={userPass.password}
        />
        {register && (
          <TextInput
            label="Confirm password"
            type="password"
            id="verified"
            onChange={event => setValidatedPass(event.target.value)}
            disabled={!userPass.password}
            error={validate}
            helperText={validate ? "passwords do not match" : ""}
          />
        )}
        <AutoCompleteText
          options={types}
          optionLabel={wordCapitalization}
          label="Role"
          onInputChange={event => {
            autocompleteOnChange(event, setUserPass, "type", types);
          }}
        />
        <AutoCompleteText
          options={companies.list}
          optionLabel={wordCapitalization}
          label="Company"
          freeSolo={userPass.type === "administrator" && register}
          onInputChange={event => {
            autocompleteOnChange(event, setUserPass, "company", companies.list);
          }}
        />
      </LoginCard>
    </div>
  );
};

export default Login;
