import React, { useContext, useState } from "react";

import "./Auth.css";
import Card from "../UIElements/Card";
import Input from "../FormElements/Input";
import Button from "../FormElements/Button";
import ErrorModal from "../UIElements/ErrorModal";
import LoadingSpinner from "../UIElements/LoadingSpinner";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../util/validators";
import { useForm } from "../hooks/form-hook";
import { useHttpClient } from "../hooks/http-hook";
import { AuthenticationContext } from "../Context/authContext";
import ImageUpload from "../FormElements/ImageUpload";

const Auth = () => {
  const auth = useContext(AuthenticationContext);
  const [isLoginMode, setIsLoginMode] = useState(true);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      const imgBody = formState.inputs.image;
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false
          }
        },
        false
      );
    }

    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(formState.inputs.image);

    if (isLoginMode) {
      try {
        const postData = {
          email: formState.inputs.email.value,
          password: formState.inputs.password.value,
        };
        const url = "/api/users/login";
        const response = await sendRequest(
          url,
          "POST",
           postData,
        );
         console.log(response.data.userId);
          auth.login(response.data.userId, response.data.token);
      } 
      catch (err) {
        console.log(err);
        
      }
    } else {
      try {
        // const postData = {
        //   name: formState.inputs.name.value,
        //   email: formState.inputs.email.value,
        //   password: formState.inputs.password.value,
        //   image: formState.inputs.image.value
        // };
        const formData = new FormData();
formData.append("name", formState.inputs.name.value);
formData.append("email", formState.inputs.email.value);
formData.append("password", formState.inputs.password.value);
formData.append("image", formState.inputs.image.value);

        const response = await sendRequest(
          "/api/users/signup",
          "POST",
          formData
        );
        // const response = await Finder.post("/api/users/signup", postData);
        console.log(response.data.userId);
         auth.login(response.data.userId, response.data.token);
      } catch (err) {
        console.log(err);
      }
    }
  };


  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name."
              onInput={inputHandler}
            />
          )}
          {!isLoginMode && <ImageUpload center id="image" onInput={inputHandler} errorText="Please provide a image" />}

          <Input
            element="input"
            id="email"
            type="email"
            label="Email"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid a email id"
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid a password of atleast of 6 characters."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "Login" : "SIGNUP"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          Switch to {isLoginMode ? "SIGNUP" : "LOGIN"}
        </Button>
      </Card>
    </>
  );
};

export default Auth;
