import { dbService, storageService } from "../fbase";
import React, { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";



const NweetFactory = ({ userObj }) => {
    const [nweet, setNweet] = useState('');
    const [attachment, setAttachment] = useState('');
    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl = '';
        if(attachment !== ''){
            const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
        
            const response = await uploadString(attachmentRef, attachment, "data_url");
            
            attachmentUrl = await getDownloadURL(response.ref);
        }
        
        const nweetObj = {
            text: nweet,
            createdAt : Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        }

        await addDoc(collection (dbService, 'nweets'),nweetObj);
        setNweet('');
        setAttachment('');
        fileInput.current = null;
    };

    const onChange = (event) => {
        const {target : {value}}  =event;
        setNweet(value);
    }
    
    const onFileChange = (event)=>{
        const {target:{files}} = event;

        if(files.length !== 0){
            const theFile = files[0];
            const reader = new FileReader();
            reader.onloadend = (finishedEvent)=>{
                const {currentTarget:{result}} = finishedEvent;
                setAttachment(result);
            }
            reader.readAsDataURL(theFile);
        }
        

    }

    const fileInput = useRef();

    const onClearAttachment = () => {
        setAttachment('')
        fileInput.current.value = null;
    }

    return (
        <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label htmlFor="attach-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{
          opacity: 0,
        }}
      />
      {attachment && (
        <div className="factoryForm__attachment">
          <image
            src={attachment}
            style={{
              backgroundImage: attachment,
            }}
          />
          <div className="factoryForm__clear" onClick={onClearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
    )
}

export default NweetFactory;