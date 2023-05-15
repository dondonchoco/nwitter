import { getDownloadURL, ref, uploadString } from "firebase/storage";
import Nweet from "../components/Nweet";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "../fbase";
import { addDoc, collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";

const Home = ({ userObj }) => {
    const [nweet, setNweet] = useState('');
    const [nweets, setNweets] = useState([]);
    const [attachment, setAttachment] = useState('');
    useEffect(()=>{
        //getNweets();
        const q = query(collection(dbService,"nweets"),orderBy("createdAt","desc"));
        onSnapshot(q,(snapshot)=>{
            const nweetArray = snapshot.docs.map((doc)=>({
                id: doc.id,
                ...doc.data(),
            }))
            setNweets(nweetArray);
        })
        
    },[]);
     
    // const getNweets = async(event) => {
    //     setNweets([]);
    //     // 쿼리스냅샷으로 데이터 가져옴
    //     const dbNweets = await getDocs(collection(dbService, "nweets"));
    //     // 가져온 데이터 뭉치에서 데이터만 가져옴
    //     dbNweets.forEach((document) => {
    //         const nweetObject = {
    //             ...document.data(),
    //             id: document.id,
    //         }
    //         setNweets(prev => [nweetObject, ...prev])
    //     });
    // }
   
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

        await addDoc(collection(dbService, 'nweets'),nweetObj);
        setNweet('');
        setAttachment('');
        fileInput.current.value = null;
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

    return(
        <div>
            <form onSubmit={onSubmit}>
                <input value={nweet} onChange={onChange} type='text' placeholder="What's on your mind?" maxLength={120} />
                <input type="file" accept="image/*" onChange={onFileChange} ref={fileInput}/>

                <input type="submit" value="Nweet" />
                
                {attachment && 
                <div>
                    <img src={attachment} width="50px" height ="50px" />
                    <button onClick={onClearAttachment}>Clear</button>
                </div>
                }
            </form>
            <div>
                {nweets.map((nweet)=>
                    <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid}/>
                    )}
            </div>
        </div>
    )
}
export default Home;