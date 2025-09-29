import React,{ useState,useEffect } from 'react'
import './TopBar.css'

function TopBar({ contact, pageMode, onlineUsers, setCurrentChat }) {
  const [ isMobile,setIsMobile ] = useState('');
  const [ membersNum, setMembersNum ] = useState('')

  const goBack = () => {
    document.querySelector('body').classList.remove('messageActive')
    setCurrentChat(false)
  }

  useEffect(() => {
      window.innerWidth < 500 ? setIsMobile(true) : setIsMobile(false)
  },[]);

  useEffect(() => {
    if(contact.type === "Group") {
      setMembersNum(contact.members.length)
    }
  }, [contact]);
  
  return (
    <>
        <header className='mainHeader'>
          <span className='userPartSpan'>
            <button id='toBackBtn'
                    onClick={goBack}>
              <img src={`${pageMode || isMobile ? './messageIcons/left-light-arrow.png' : './messageIcons/left-dark-arrow.png'}`}/>
            </button>

            <span className='avatarImg'>
              {contact.avatarImg ? 
              <img 
                className='userImg'
                src={ contact.avatarImg }/> 
                :
                <div className='savedContact'>
                  <img src='./messageIcons/savedIcon.png'/>
                </div>
              }
            </span>

            <div className='textDiv'>
              <h2 className='userNameText'>
                {contact.username}
              </h2>

              <p className={`onlineUser ${onlineUsers.includes(contact._id) ? 'online' : 'offline'}`}>
                <span>
                  {
                    contact.topbarBottomText ?
                    contact.topbarBottomText :
                    contact.members ? `${membersNum} members` :
                      onlineUsers.includes(contact._id) ? 'Online' : 'Last seen recently'
                  }  
                </span>
              </p> 
            </div>
          </span>

          <span className='rightIconsSpan'>
            <button>
              <img src={`${pageMode || isMobile ? './topIcon/light/call.png' : './topIcon/dark/call.png'}`}/>
            </button>
              <button>
                <img src={`${pageMode || isMobile ? './topIcon/light/video.png' : './topIcon/dark/video.png'}`}/>
              </button>
            <button>
              <img src={`${pageMode || isMobile ? './topIcon/light/dots.png' : './topIcon/dark/dots.png'}`}/>
            </button>
          </span>
        </header>
    </>
  )
}

export default TopBar;