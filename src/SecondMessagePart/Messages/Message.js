import React from 'react'
import TopBar from '../TopBar/TopBar'
import './Message.css';
import MessagePart from '../MessagePart/MessagePart'

function Message({ contact, currentUser, pageMode, onlineUsers, returnLastMessage, isSelectedImage, avatarImg, setCurrentChat}) {

  return (
    <section className='mainSectionMessage'>
        <TopBar 
          contact={contact} 
          pageMode={pageMode} 
          onlineUsers={onlineUsers}
          setCurrentChat={setCurrentChat}/>

        <MessagePart currentUser={currentUser}
                     contact={contact}
                     pageMode={pageMode}
                     returnLastMessage={returnLastMessage}
                     isSelectedImage={isSelectedImage}
                     avatarImg={avatarImg}/>
    </section>
  ) 
}

export default Message