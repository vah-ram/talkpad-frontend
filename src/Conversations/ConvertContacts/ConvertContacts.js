import React, { useState, useEffect } from 'react';
import '../ConvertUsers/ConvertUsers.css'
import socket from '../../pages/Socket';

function ConvertContacts({ username, handleCheck, select, index, contact, onContextMenu, avatarImg, currentUser }) {

    const [ lastMessage,setLastMessage ] = useState('')

    const clickChat = (index,contact) => {
        handleCheck(index,contact);
        document.querySelector('body').classList.add('messageActive')
    }

    useEffect(() => {
        const handleLastMessage = (data) => {
            if (data.from === contact._id || data.to === contact._id) {
                setLastMessage(data);
            }
        };

        socket.on('last-message', handleLastMessage);

        return () => {
            socket.off('last-message', handleLastMessage);
        };
    }, [contact._id]);

    useEffect(() => {   
        if(lastMessage) {
            localStorage.setItem(`last-message-by-${contact._id}`, JSON.stringify(lastMessage));
        }
    }, [lastMessage,contact._id]);

    useEffect(() => {
        const savedMessage = localStorage.getItem(`last-message-by-${contact._id}`);
        if(savedMessage) {
            setLastMessage(JSON.parse(savedMessage))
        }
    },[contact._id]);

    return (
    <>
    <div className={`UserItem ${
            index === select ? 'selected' : ''
        }`}
        onClick={() => clickChat(index,contact)}
        onContextMenu = {(e) => onContextMenu(e, contact._id)}>
        <span className='styleSpan'>
            <span className='contactAvatarSpan'>
                <img src={avatarImg}/>
            </span>
            
            <span className='SecondSpan'>
                <h2 className='username'>
                    {username}
                </h2>

                    <p className='lastMessage'>
                        {lastMessage ? (
                            lastMessage.from === currentUser._id ?
                            `You: ${lastMessage.message.slice(0, 10)}` :
                            `${contact.username}: ${lastMessage.message}`
                        ) : (
                            "No messages!"
                        )
                        }
                    </p>
            </span>
        </span>
    </div>

    </>
  )
}

export default ConvertContacts