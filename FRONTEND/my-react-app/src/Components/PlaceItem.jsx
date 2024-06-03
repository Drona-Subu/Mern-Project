import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import Card from "../UIElements/Card";
import Button from "../FormElements/Button";
import Modal from "../UIElements/Modal";
import Map from "../UIElements/Map";
import ErrorModal from "../UIElements/ErrorModal";
import LoadingSpinner from "../UIElements/LoadingSpinner";
import "./PlaceItem.css";
import { AuthenticationContext } from "../Context/authContext";
import { useHttpClient } from "../hooks/http-hook";


const PlaceItem = (props) => {
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const auth = useContext(AuthenticationContext);
  const {isLoading, error, sendRequest, clearError} = useHttpClient();

  const history = useNavigate();

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try{
      await sendRequest(
        `/api/places/${props.id}`,
        'DELETE',
        null ,
        {
          Authorization: `Bearer ${auth.token}`
        }
      );
      props.onDelete(props.id); 
    }
    catch(err) {
    }
    
    // console.log("Deleting");
  };

  return (
    <>
    <ErrorModal error={error} onClear={clearError} /> 
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.location} zoom={14} text={props.title} />{" "}
        </div>
      </Modal>

      <Modal
      show={showConfirmModal}
      onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <>
            <Button inverse onClick={cancelDeleteHandler}>CANCEL</Button>
            <Button danger onClick={confirmDeleteHandler}>DELETE</Button>
          </>
        }
      >
        <p>Do you want to delete it?</p>
      </Modal>

      <li className="place-item">
        <Card>
        {isLoading && <LoadingSpinner asOverlay />}
          <div className="place-item__image">
            <img src={`http://localhost:5000/${props.image}`} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              View on Map
            </Button>
            {auth.userId === props.creatorId && <Button to={`/places/${props.id}`}>Edit</Button>}
            { auth.userId === props.creatorId && <Button danger onClick={showDeleteWarningHandler}>Delete</Button>}
          </div>
        </Card>
      </li>
    </>
  );
};

export default PlaceItem;
