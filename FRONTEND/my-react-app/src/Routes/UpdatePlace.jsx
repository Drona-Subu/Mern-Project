import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Input from "../FormElements/Input";
import Button from "../FormElements/Button";
import { useForm } from "../hooks/form-hook";
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from "../util/validators";
import { useHttpClient } from "../hooks/http-hook";
import "./PlaceForm.css";
import LoadingSpinner from "../UIElements/LoadingSpinner";
import ErrorModal from "../UIElements/ErrorModal";
import { AuthenticationContext } from "../Context/authContext";

const UpdatePlace = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState();
  const placeId = useParams().placeId;

  const history = useNavigate();
  const auth = useContext(AuthenticationContext);

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const response = await sendRequest(`/api/places/${placeId}`);
        setLoadedPlace(response.data.place);
        setFormData(
          {
            title: {
              value: response.data.place.title,
              isValid: true,
            },
            description: {
              value: response.data.place.description,
              isValid: true,
            },
          },
          true
        );
      } 
      catch (err) {}
    };
    fetchPlace();
  }, [sendRequest, placeId, setFormData]);


  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    try{
      const postData = {
        title: formState.inputs.title.value,
        description: formState.inputs.description.value
      };
      await sendRequest(
        `/api/places/${placeId}` ,
        'PATCH',
        postData,
        {
          Authorization: `Bearer ${auth.token}`
        }
      );
      history(`/${auth.userId}/places`);
    }
    catch(err){
    }
  };

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <h2>Could not find place.</h2>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="center">
        < LoadingSpinner />
      </div>
    );
  }

  return (
      <>
      < ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedPlace && (<form className="place-form" onSubmit={placeSubmitHandler}>
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
          value={loadedPlace.title}
          valid={true}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description(min 5 characters)."
          onInput={inputHandler}
          value={loadedPlace.description}
          valid={true}
        />
        <Button type="submit" disabled={!formState.isValid}>
          Update place.
        </Button>
      </form>) }
      </>
    
  );
};

export default UpdatePlace;
