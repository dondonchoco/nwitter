import Nweet from "../components/Nweet";
import { dbService } from "../fbase";
import { addDoc, collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";

const Home = ({ userObj }) => {
    const [nweet, setNweet] = useState('');
    const [nweets, setNweets] = useState([]);
    
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
        
        await addDoc(collection(dbService,'nweets'),{
            text: nweet,
            createdAt : Date.now(),
            creatorId: userObj.uid,
        });
        setNweet('');
        
        // getNweets();
    };

    const onChange = (event) => {
        const {target : {value}}  =event;
        setNweet(value);
    }
    
    console.log(nweets);
    
    return(
        <div>
            <form onSubmit={onSubmit}>
                <input value={nweet} onChange={onChange} type='text' placeholder="What's on your mind?" maxLength={120} />
                <input type="submit" value="Nweet" />
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