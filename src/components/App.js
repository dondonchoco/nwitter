import React, { useEffect, useState } from "react";
// import AppRouter from "components/Router";
import AppRouter from "./Router"
// import fbase from "../fbase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { authService } from "../fbase";

function App() {
  const [init, setInit] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(()=>{
    const auth = getAuth();
    onAuthStateChanged(auth,(user)=>{
      if(user){
        // setIsLoggedIn(true);
        // setUserObj(user);
        setUserObj({
          displayName: user.displayName,
          uid:user.uid,
          updateProfile: (args) => user.updateProfile(args),
        })
      }else{
        setUserObj(null);
      }
      // else{
      //   setIsLoggedIn(false);
      // }
      setInit(true);
    }) 
  },[])
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid:user.uid,
      updateProfile: (args) => user.updateProfile(args),
    });
  }

  return (
  <>
  {init ? <AppRouter refreshUser={refreshUser} isLoggedIn={Boolean(userObj)} userObj={userObj}/> : 'Initializing......'}
  </>);
}

export default App;