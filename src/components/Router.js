import React, { useState } from "react";
import { HashRouter as Router, Route, Routes, Switch } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Navigation from "./Navigation";
import Profile from "../routes/Profile";

const AppRouter = ({ isLoggedIn, userObj }) => {
    
    return (
        <Router>
            {isLoggedIn && <Navigation />}
            <Routes>
                {isLoggedIn ? (
                    <>
                        <Route path='/' element={<Home userObj={userObj} />} />
                        <Route path='/Profile' element={<Profile />} />
                    </>
                    )
                    :(
                    <>
                        <Route path='/' element={<Auth />} />
                    </>
                    )
                }
                
            </Routes>
            
        </Router>
    )
}

export default AppRouter;