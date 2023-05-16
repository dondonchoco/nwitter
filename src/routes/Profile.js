import { authService, dbService } from "../fbase";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

 const Profile = ({ refreshUser, userObj }) => {
    console.log(userObj);
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const navi = useNavigate();
    const auth = getAuth();
    const onLogOutClick = () => {
        signOut(auth);
        navi('/');
    }
    const getMyNweet = async () => {
        const q = query(collection(dbService, "nweets"),where("creatorId","==", userObj.uid));
        
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc)=>{
            console.log(doc.id);
            console.log(doc.data());
        })
    }

    useEffect(()=>{
        getMyNweet();
    }, [])

    const onChange = (event) => {
        const {target : {value}} = event;
        setNewDisplayName(value);
    }

    const onSubmit = async (event) => {
        
        event.preventDefault();
        if(userObj.displayName !== newDisplayName){
            await updateProfile(authService.currentUser, {displayName : newDisplayName});
        }   
        refreshUser();
    }
    return (
        <>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="Display name" onChange={onChange} value={newDisplayName}/>
                <input type="submit" value="Update Profile" />
            </form>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    )
 }

 export default Profile