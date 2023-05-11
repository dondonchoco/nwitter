import { GithubAuthProvider, GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import React, { useState } from "react";

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState('');

    const onChange = (event) => {
        const {target: {name, value}} = event;
        if(name === 'email'){
            setEmail(value);
        }else if(name === 'password'){

            setPassword(value);
        }
    }

    const onSubmit = async(event)=>{
        event.preventDefault();
        try{
            const auth = getAuth();
            let data;
            if(newAccount){
                // create account
                data = await createUserWithEmailAndPassword(
                    auth, email, password
                );
            }else {
                // log in
                data = await signInWithEmailAndPassword(auth, email,password);
            }
            console.log(data);
        }catch(error){
            setError(error.message);
        }   
    }

    const toggleAccount = () => setNewAccount(prev => !prev);

    const onSocialClick = async(event) => {
        console.log(event.target.name);
        const {target : {name}} = event;
        let provider;
        const auth = getAuth();
        try {
            if(name === 'google'){
                provider = new GoogleAuthProvider();
            }else if(name === 'github'){
                provider = new GithubAuthProvider();
            }
            const data = await signInWithPopup(auth, provider);
            console.log(data);
        } catch (error){
            console.log(error);
        }
    }
    
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input name="email" type="email" placeholder="Email" required value={email} onChange={onChange}/>
                <input name="password" type="password" placeholder="Password" required value={password} onChange={onChange}/>
                <input type="submit" value={newAccount ? "Create Account" : "Sign in"} />
                <br />{error}
            </form>
            <span onClick={toggleAccount}>{newAccount ? "Sign in" : "CreateAccount"}</span>
            <div>
                <button name="google" onClick={onSocialClick}>Continue with Google</button>
                <button name="github" onClick={onSocialClick}>Continue with Github</button>
            </div>
        </div>
    )
}

export default Auth;