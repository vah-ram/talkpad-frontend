import React, { useRef, useState, useEffect, lazy } from 'react'
import './MessagePart.css'
import MessageItem from './MessageItem'
import axios from 'axios'
import { addMessage, getMessage, getFiles, editMessageRoute } from './utils/messageHost'
import socket from '../../pages/Socket.js'
const EmojiPicker = lazy(() => import('emoji-picker-react'));

function MessagePart({ currentUser, contact, pageMode, isSelectedImage, avatarImg }) {
  const MessageScrollRef = useRef(null);
  const inputRef = useRef(null);

  const [ messages,setMessages ] = useState([]);
  const [ message,setMessage ] = useState('');
  const [ arrivalMessage,setArrivalMessage ] = useState(null);
  const [ openEmoji, setOpenEmoji ] = useState(false);
  const [ editBar, setEditBar ] = useState(false);
  const [ messageId, setMessageId ] = useState('');
  const [ thatMessage, setThatMessage ] = useState('')

  const sendMessageSound = document.querySelector('#sendMessageSound');

  const handleEmoji = (e) => {
    setOpenEmoji(false);
    setMessage((prev) => prev + e.emoji);
  }

  useEffect(() => {
    if (editBar) {
      document.body.classList.add('editActivated');
    } else {
      document.body.classList.remove('editActivated');
    }
  }, [editBar]);

  const sendMessage = async ( imageUrl ) => {
    if( message !== '' || imageUrl ) {
      try {
          const response = await axios.post(addMessage, {
            from: currentUser._id,
            to: contact._id,
            image: imageUrl,
            message: message,
          });

          const newMessage = response.data;

          socket.emit('send-message', {
            from: currentUser._id,
            to: contact._id,
            image: imageUrl,
            message: message,
            type: contact.type,
            createdAt: newMessage.createdAt,
          });

          const items = [...messages];
          items.push({ 
            fromSelf: true, 
            image: imageUrl,
            message: message, 
            contactId: contact._id,
            createdAt: newMessage.createdAt,
            id: newMessage._id
          });
          setMessages(items);

          if(sendMessageSound) {
            sendMessageSound.play()
          }
      } catch(err) {
        console.log(err)
      }
    };
    setMessage('')
  };

  const sendFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append('image', file);
  
    try {
      const res = await axios.post(getFiles, formData);
      const imageUrl = res.data.url;
  
      sendMessage(imageUrl); 
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on('receive-message', (item) => {
        const isFromSelf = item.from === currentUser._id;
  
        const isPrivateChat = 
          (item.from === contact._id && item.to === currentUser._id) ||
          (item.from === currentUser._id && item.to === contact._id);
  
        const isGroupChat = item.to === contact._id && contact.type === "Group"; 
        
        if (isPrivateChat || isGroupChat) {
          if(!isGroupChat) {
            setTimeout(() => {
              const audio = document.querySelector('#receiveMessageSound');
              if (audio) audio.play();
            }, 1); 
          }
    
          if (!isFromSelf) {
            setArrivalMessage({
              fromSelf: false,
              image: item.image,
              message: item.message,
              contactId: contact._id,
              createdAt: item.createdAt || new Date().toISOString()
            });
          }
        }
      });
  
      return () => {
        socket.off('receive-message');
      };
    }
  }, [socket, contact, currentUser, messages]);
  

  useEffect(() => {
    if(arrivalMessage) {
      setMessages(prev => [...prev,arrivalMessage]);
    }
  },[arrivalMessage]);

  useEffect(() => {
    const callAsync = async () => {
      try {
        const result = await axios.get(getMessage, {
          params: {
            sender: currentUser._id,
            receiver: contact._id,
          },
        });
        setMessages(result.data.messages);
      } catch (err) {
        console.log(err);
      }
    };

    callAsync()

      socket.on("refresh-message", ({ contactId }) => {
        if( contactId === contact._id ) {
          callAsync()
        }
      });
  }, [contact]);
  

  useEffect(() => {
    MessageScrollRef.current?.scrollIntoView()
  }, [ messages, arrivalMessage]);
  
  const deleteMessage = ( deletedMessageId ) => {
    setMessages((prevs) => prevs.filter((item) => item.id !== deletedMessageId && item._id !== deletedMessageId))
  }

  const IseditMessage = ( id, OneMessage ) => {
    if(id) {
      setEditBar(true);
      inputRef.current.focus();
      setMessageId(id);
      setThatMessage(OneMessage)
    }
  }

  const editMessage = async() => {
    setEditBar(false); 
    setMessage('');
      socket.emit("refresh-message", {
        from: currentUser._id,
        to: contact._id,
        type: contact.type
      })

    try {
        await axios.put( editMessageRoute, {
          messageId: messageId,
          editedMessage: message
        });
    } catch(err) {
      console.log(err)
    }
  }

  return (
        <section className='PartSection'>
          <section className='sectionMessage'>
              {
                messages.map((item,index) => {
                  return (
                    <MessageItem 
                      own={item.fromSelf ? true : false} 
                      item={item}
                      key={index}
                      contact={contact}
                      messageDelete={deleteMessage}
                      isSelectedImage={isSelectedImage}
                      avatarImg={avatarImg}
                      editMessage={IseditMessage}
                      currentUser={currentUser}
                    />
                  )
                })
              }
            <div ref={MessageScrollRef}/>
          </section>

          {
            editBar && 
              <section className='editSection'>
                  <div>
                    <h2>Edit message</h2>
                    <p>{thatMessage}</p>
                  </div>
                <span onClick={() => setEditBar(false)}/>
              </section>
          }

          <footer className='typeMessageFooter'>

          <button 
            className='SmilesBtn'
            onClick={() => setOpenEmoji(!openEmoji)}>

            <img src={`${pageMode ? './messageIcons/light/smile.png' : './messageIcons/dark/smile.png'}`}/>
          
            {
              openEmoji &&
                <EmojiPicker 
                open={openEmoji} 
                onEmojiClick={handleEmoji}
                className='emojiPicker'/>
            }
          </button>
  
              <form className='inputForm'
                    onSubmit={e => {
                      e.preventDefault();
                      {
                        editBar ? 
                          editMessage()
                        :
                        sendMessage()
                      }
                    }}>
                <input 
                  type="text" 
                  placeholder="Message..."
                  className='typeInput'
                  ref={inputRef}
                  value={ message }
                  onChange={e => setMessage(e.target.value)}/>
              </form>

              {
                message === '' ?
                <>
                  <label className='filesBtn' for='file'>
                  <img src={`${pageMode ? './messageIcons/light/filesIcon.png' : './messageIcons/dark/filesIcon.png'}`}/>
                      <input 
                        type='file'
                        id='file'
                        style={{display: 'none'}}
                        accept="image/jpg,image/png,image/jpeg,image/gif"
                        onChange={sendFile}/>
                  </label>
                  <button className='microphoneBtn'>
                    <img src={`${pageMode ? './messageIcons/light/microphone.png' : './messageIcons/dark/microphone.png'}`}/>
                  </button>
                </>
                :
                (editBar ?
                  <button type='button'
                  onClick={() => editMessage()}
                  className='sendBtn editBtn'>
                     <img src="./messageIcons/edit.png" loading='lazy'/>
                </button>
                :
                <button type='button'
                  onClick={() => sendMessage()}
                  className='sendBtn'>
                    <img src="./messageIcons/send.png" loading='lazy'/>
                </button>
                )
              }
              <audio src='./sounds/send-message.mp3' id='sendMessageSound' preload='auto'/>
              <audio src='./sounds/receive-message.mp3' id='receiveMessageSound' preload='auto'/>
          </footer>
      </section>
  ) 
}

export default MessagePart

