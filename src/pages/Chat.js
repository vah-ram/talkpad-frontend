import React, { useState,useEffect } from 'react'
import Conversation from '../Conversations/Conversation.js'
import Message from '../SecondMessagePart/Messages/Message.js'
import '../css/chatStyle.css'
import { useNavigate } from 'react-router-dom'
import Welcome from './Welcome.jsx'
import socket from './Socket.js'; 
import ViewPicture from '../SecondMessagePart/MessagePart/viewPicture.js'
import axios from 'axios'
import { getAvatar } from './utils/apiRoute.js'
import GroupPart from '../Conversations/GroupPart.js'

function Chat() {
  const navigate = useNavigate();

  const [ onlineUsers,setOnlineUsers ] = useState([])
  const [ currentUser,setCurrentUser ] = useState('');
  const [ currentChat,setCurrentChat ] = useState('');
  const [ pageMode,setPageMode ] = useState('');
  const [ viewPicturebool, setViewPicture ] = useState(false);
  const [ imageUrl, setImageUrl ] = useState('');
  const [ avatarImg,setAvatarImg ] = useState('');
  const [ itsGroupPart,setItsGroupPart ] = useState('');

  useEffect(() => {
    const callAsync = async() =>  {
      if(!localStorage.getItem('chat-user-Item')) {
        navigate('/login')
      } else {
        setCurrentUser(await JSON.parse(localStorage.getItem('chat-user-Item')))
      }
    };
    callAsync();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    socket.emit("add-user", currentUser._id);

    socket.on('online-users', (users) => {
      setOnlineUsers(users)
    });
  }, [currentUser]); 
  

  const changeChat = (contact) => {
    if(contact.type === "Group") {
      socket.emit("join-group", contact._id)
    };

    setCurrentChat(contact);
    setItsGroupPart(false)
  }

  const changeMode = (value) => {
    setPageMode(value)
  }

  const isSelectedImage = ( bool, url ) => {
    setViewPicture(bool)
    setImageUrl(url)
  } 

  const closeSelectedImage = () => {
    setViewPicture(false)
  }

  useEffect(() => {
    const callSync = async () => {
      if (currentUser) {
        const result = await axios.get(`${getAvatar}?myId=${currentUser._id}`);
        setAvatarImg(result.data);
      }
    };
    callSync();
  }, [currentUser]);
  
  const getGroupBool = (i) => {
    setItsGroupPart(i)
  }

  return (
    <div id='container'>
        {
        viewPicturebool ? (
        <ViewPicture imageUrl={imageUrl} closeSelectedImage={closeSelectedImage}/>
      ) : ( 
          <>
            <Conversation 
              currentUser={currentUser} 
              changeChat={changeChat}
              changeModePage={changeMode}
              onlineUsers={onlineUsers}
              avatarImg={avatarImg}
              getGroupBool={getGroupBool}
            />
            
            {
            itsGroupPart ? 
            <GroupPart 
              getGroupBool={getGroupBool} 
              pageMode={pageMode}
              currentUser={currentUser}/> :
            currentChat ? (
              <Message 
                contact={currentChat} 
                currentUser={currentUser}
                pageMode={pageMode}
                onlineUsers={onlineUsers}
                isSelectedImage={isSelectedImage}
                avatarImg={avatarImg}
                setCurrentChat={setCurrentChat}
              />
            ) : (
              <Welcome />
            )}
          </>
          )}
    </div>
  )
}

export default Chat