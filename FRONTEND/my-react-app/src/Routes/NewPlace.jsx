import React, {useContext} from "react";
import { useNavigate } from "react-router-dom";

import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../util/validators";
import Input from "../FormElements/Input";
import Button from "../FormElements/Button";
import ErrorModal from "../UIElements/ErrorModal";
import LoadingSpinner from "../UIElements/LoadingSpinner";
import {useForm} from "../hooks/form-hook";
import { useHttpClient } from "../hooks/http-hook";
import { AuthenticationContext } from "../Context/authContext";
import ImageUpload from "../FormElements/ImageUpload";
import "./NewPlace.css";

const NewPlace = (props) => {

  const auth = useContext(AuthenticationContext);
  const {isLoading, error, sendRequest, clearError} = useHttpClient();
  
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      },
      address: {
        value: '',
        isValid: false
      },
      image: {
        value: null ,
        isValid: false
      }
    },
    false
  );

  const history = useNavigate();

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    // console.log(formState.inputs);

    try{
      const formData = new FormData();
      formData.append('title', formState.inputs.title.value );
      formData.append('description', formState.inputs.description.value );
      formData.append('address', formState.inputs.address.value );
      formData.append('image', formState.inputs.image.value );

      await sendRequest('/api/places',
      'POST',
      formData,
      {
        Authorization: `Bearer ${auth.token}`
      }
    );

    history('/');
    }
    catch(err) {
      console.log(err);
    }
  }

  return (
    <>
    <ErrorModal error={error} onClear={clearError} />
    <form className="place-form" onSubmit={placeSubmitHandler}>
    {isLoading && <LoadingSpinner asOverlay />}
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description(atleast 5 characters)."
        onInput={inputHandler}
      />
      <Input
        id="address"
        element="input"
        label="Address"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid address."
        onInput={inputHandler}
      />
      < ImageUpload center id="image" onInput={inputHandler} errorText="Please provide an image." />
      <Button type="submit" disabled={!formState.isValid}>
        ADD PLACE
      </Button>
    </form>
    </>
  );
};

export default NewPlace;
