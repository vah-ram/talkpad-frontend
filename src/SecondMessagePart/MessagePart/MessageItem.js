import React, { useState, useEffect } from 'react'
import './MessageItem.css'
import axios from 'axios';
import socket from '../../pages/Socket.js'
import { deleteMessage } from './utils/messageHost.js'

export default function MessageItem({ own, item, contact, messageDelete, isSelectedImage, avatarImg, editMessage, currentUser }) {

  const [ openBar, setOpenBar ] = useState({ valid: false, x:0 , y:0 })

  const TimeFormat = ( timestamp ) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  };

  const contextMessage = async ( id, own ) => {
    setOpenBar(false);

    if (own) {
      socket.emit("refresh-message", {
        from: currentUser._id,
        to: contact._id,
        type: contact.type
      })
      try {
        await axios.delete(`${deleteMessage}?messageId=${id}`);
        messageDelete(id);
      } catch (err) {
        console.log('Something went wrong!', err);
      }
    }
  };

  useEffect(() => {
    const handleClick = () => {
      if (openBar.visible) {
        setOpenBar(prev => ({ ...prev, visible: false }));
      }
    };
  
    window.addEventListener('click', handleClick);

    return () => window.removeEventListener('click', handleClick);
  }, [openBar.visible]);
  
  const copyText = (message) => {
    navigator.clipboard.writeText(message)
  }

  return (
    <div className={own ? 'message own' : 'message'}>
        <div className='messageTop'>
            <img
                className='messageImg'
                src={ own ? avatarImg : contact.avatarImg }
            />
            <div>
            {
              item.image ? 
                <div className='fileMessage'>
                  {item.image && 
                  <>
                  <div className='picturePart' onClick={() => isSelectedImage( true, item.image )}>
                    <img 
                      src={item.image} 
                      alt='image' 
                      loading='lazy'/>
                  </div>

                  <span className="timestamp">{ TimeFormat(item.createdAt) }</span></>}
                </div> 
              :
                <>
                  <div className='messageDiv'>
                    <p 
                      className='messageText' 
                      id='messageText'
                      onContextMenu={(e) => {
                        e.preventDefault();
                        if(own) {
                          setOpenBar({ visible: true, x: e.pageX, y: e.pageY })
                        }
                      }}>
                      { item.message }
                    </p>
                    <span className="timestamp">{ TimeFormat(item.createdAt) }</span>
                    
                    <div 
                      className='contextDivBar'
                      style=
                      { openBar.visible ? { display: 'flex' } :
                      { display: 'none' }
                    }>
                      <span onClick={() => editMessage(item.id, item.message)}>
                        Edit
                      </span>
                      <span onClick={() => copyText(item.message)}>
                        Copy Text
                      </span>
                      <span 
                        onClick={() => {
                          contextMessage(item.id, own, contact);
                          if (own) {
                            messageDelete(item.id);
                          } 
                        }}>
                            Delete
                      </span>
                    </div>
                  </div>
                </>
            }
            </div>
        </div>
    </div>
  )
}
