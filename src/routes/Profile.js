import { getAuth, signOut } from "firebase/auth";
import React from "react";
import { unstable_HistoryRouter, useNavigate } from "react-router-dom";

 export default () => {
    const navi = useNavigate();
    const auth = getAuth();
    const onLogOutClick = () => {
        signOut(auth);
        navi('/');
    }

    return (
        <>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    )
 }