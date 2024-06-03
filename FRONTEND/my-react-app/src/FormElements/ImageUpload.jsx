import React, {useRef, useState, useEffect} from "react";

import Button from "./Button";
import "./ImageUpload.css";

const ImageUpload = (props) => {

    const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
    const [isValid, setIsValid] = useState(false);

    const filePickerRef = useRef();

    useEffect(() => {
        if(!file){
            return;
        }
        const fileReader = new FileReader();
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result);
        };
        fileReader.readAsDataURL(file);
        console.log(file);

    }, [file]);

    const pickedHandler = (event) => {
        let pickedFile;
        let fileIsValid = isValid;
        if (event.target.files && event.target.files.length === 1){
             pickedFile = event.target.files[0];
            setFile(pickedFile);
            // the set function doesnt immediately changes the value so if you send 
            // it as arguments props.onInput() it will send the old value.
            setIsValid(true);
             fileIsValid = true;
        }
        else {
            setIsValid(false);
            fileIsValid = false;
        }
        props.onInput(props.id, pickedFile, fileIsValid);
    };

    const pickImageHandler = () => {
        filePickerRef.current.click();
    }

  return (
    <div className="form-control">
      {/* none value of display ensures it is hidden */}
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
           {previewUrl && <img src={previewUrl} alt="Preview" />} 
           {!previewUrl && <p>Please pick an image</p>}
        </div>
        <Button type="button" onClick={pickImageHandler} >
            PICK IMAGE
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
