import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthForm from "../components/AuthForm";
import { GithubAuthProvider, GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import React from "react";
import { faGithub, faGoogle, faTwitter } from "@fortawesome/free-brands-svg-icons";



const Auth = () => {
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
        <div className="authContainer">
            <FontAwesomeIcon
                icon={faTwitter}
                color={"#04AAFF"}
                size="3x"
                style={{ marginBottom: 30 }}
            />
            <AuthForm />
            <div className="authBtns">
                <button onClick={onSocialClick} name="google" className="authBtn">
                Continue with Google <FontAwesomeIcon icon={faGoogle} />
                </button>
                <button onClick={onSocialClick} name="github" className="authBtn">
                Continue with Github <FontAwesomeIcon icon={faGithub} />
                </button>
            </div>
        </div>
    )
}

export default Auth;