import React from 'react';
import './ConvertUsers.css'

function ConvertUsers({ username, handleCheck, select, index, contact, avatarImg }) {
    
    const clickChat = (index,contact) => {
        handleCheck(index,contact);
        document.querySelector('body').classList.add('messageActive')
    }
  
    return (
    <>
    <div className={`UserItem ${
        index === select ? 'selected' : ''
    }`}
    onClick={() => {
        clickChat(index,contact)
    }}
    id='UserItem'>
        <span className='styleSpan'>
            
        <span className='contactAvatarSpan'>
                <img src={avatarImg}/>
            </span>
            
            <span className='SecondSpan'>
                <h2 className='username'>
                    {username}
                </h2>
            </span>
        </span>
    </div>
    </>
  )
}

export default ConvertUsers