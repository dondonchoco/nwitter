import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dbService, storageService } from "../fbase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React, { useState } from "react";
import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";



const Nweet = ({ nweetObj, isOwner }) =>  {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);
    const NweetTextRef = doc(dbService, "nweets", `${nweetObj.id}`);
    const urlRef = ref(storageService, nweetObj.attachmentUrl);

    const onDeleteClick = async() => {
        const ok = window.confirm('Are you sure you want to delete this nweet?');
        if(ok){
            // delete nweet
            await deleteDoc(NweetTextRef);
            if(nweetObj.attachmentUrl !== ''){
                await deleteObject(urlRef);
            }
            
        }
    }
    
    const toggleEditing = () => {
        setEditing((prev)=>!prev);
    }

    const onSubmit = async(event) => {
        event.preventDefault();
        await updateDoc(NweetTextRef,{text: newNweet});
        setEditing(false);
    }

    const onChangeNweet = (event) => {
        const {target:{value}} = event;
        setNewNweet(value);
    }

    return (
        <div className="nweet">
            {
                editing ? 
                    <>
                        <form onSubmit={onSubmit} className="container nweetEdit">
                            <input type="text" autoFocus placeholder="Edit your nweet" value={newNweet} onChange={onChangeNweet} required className="formInput" />
                            <input type="submit" value="Update Nweet" className="formBtn"/>
                        </form>
                        <button className="formBtn cancelBtn" onClick={toggleEditing}>Cancel</button>
                    </>
                    :
                    <>
                        <h4>{nweetObj.text}</h4>
                        {nweetObj.attachmentUrl && <image src={nweetObj.attachmentUrl} width ="50px" height="50px"></image>}
                        {isOwner && 
                            <>
                                <div className="nweet__actions">
                                    <span onClick={onDeleteClick}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </span>
                                    <span onClick={toggleEditing}>
                                        <FontAwesomeIcon icon={faPencilAlt} />
                                    </span>
                                </div>
                            </>
                        }
                    </>
            }
            
            
        </div>
    )
}

export default Nweet;