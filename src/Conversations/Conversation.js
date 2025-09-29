import React,{ useState, useEffect, useRef } from 'react'
import './Conversation.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { getUsers, addContacts, getContacts, deleteContacts } from '../pages/utils/apiRoute'
import Search from './ConvertUsers/Search'
import ConvertContacts from './ConvertContacts/ConvertContacts'
import ConvertsMenu from './ConvertContacts/ConvertsMenu'
import socket from '../pages/Socket.js'

function Conversation({ currentUser, changeChat, changeModePage, onlineUsers, avatarImg, getGroupBool }) {
  const navigate = useNavigate();
  const toActivateInput = useRef();
  
  const [ username,setUsername ] = useState('');
  const [ searchValue,setSearchValue ] = useState('');
  const [ contacts,setContacts ] = useState([]);
  const [ inputActivate,setInputActivate ] = useState(false);
  const [ users,setUsers ] = useState([]);
  const [ selected,setSelected ] = useState('');
  const [ pageMode, setPageMode ] = useState(() => {
    const saved = localStorage.getItem('pageMode');
    return saved === 'true'});
  const [ menuInfo,setMenuInfo ] = useState({ visible: false, x: 0, y: 0 , contactId: null});

  const viewSearch = () => {
    setInputActivate(true)
  };

  useEffect(() => {
    if(inputActivate) {
      toActivateInput.current.focus()
    }
  })

  const handleCheck = (index,contact) => {
          setSelected(index);
          changeChat(contact)
      };

  useEffect(() => {
    if(currentUser) {
      setUsername(currentUser.username.charAt(0).toUpperCase() + currentUser.username.slice(1))
    }// ստանում ենք անունը ու առաջին տառը սարքում մեծատառ
  });

  useEffect(() => {
    if(localStorage.getItem('loaded')) {
      navigate('/')
    } else {
      navigate('/login')
    }
  }, []);
  
  useEffect(() => {
    const menuBtn = document.querySelector('#menuBurgerDiv');
    const menuBar = document.querySelector('#sectionMenu');
    const inputSearch = document.querySelector('#inputSearch');
    const mainSection = document.querySelector('#mainSection');
    const body = document.querySelector('body');
  
    if (!menuBtn || !menuBar || !inputSearch || !mainSection) return;
  
    const handleMenuClick = () => {
      body.classList.add('activeSection');
    };
  
    const handleInputClick = () => {
      setInputActivate(true);
    };
  
    const handleDocumentClick = (event) => {
      if (!menuBar.contains(event.target) && !menuBtn.contains(event.target)) {
        body.classList.remove('activeSection');
      }
      if (!inputSearch.contains(event.target) && !mainSection.contains(event.target)) {
        setInputActivate(false);
        setSearchValue('');
        setContacts([]);
      }
    };
  
    menuBtn.addEventListener('click', handleMenuClick);
    inputSearch.addEventListener('click', handleInputClick);
    document.addEventListener('click', handleDocumentClick);
  
    return () => {
      menuBtn.removeEventListener('click', handleMenuClick);
      inputSearch.removeEventListener('click', handleInputClick);
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);
  

  const sendSearch = async(value) => {
    if (value === '') {
      setContacts([]);
      return;
    }

    try {
      if(searchValue !== '') {
      const { data } = await axios.get(`${getUsers}?username=${value}`);
      const itemUsers = data.users || [];
      const itemGroups = data.groups || [];

      setContacts((prevs) => {
          const prevItems = prevs.map(contact => contact.username.toLowerCase());

          const newItems = itemUsers.filter((user) => {
            if(user.username.toLowerCase() !== currentUser.username.toLowerCase()) {
              return !prevItems.includes(user.username.toLowerCase())
            }
          });

          const newGroups = itemGroups.filter((group) => {
            if(group.username) {
              return !prevItems.includes(group.username.toLowerCase())
            }
          });

          const allCombined = [ ...newItems, ...newGroups ];

          return [ ...prevs, ...allCombined ]
        });
      }
    } catch(err) {
      console.log(err)
    };
};

const changeSend = (evt) => {
  const value = evt.target.value
  setSearchValue(value);
  sendSearch(value)
}

const addUsers = async(user) => {
  setInputActivate(false);

  if(user.type === "Group") {
    socket.emit("join-group", user._id)
  }

  setUsers(prevUsers => {
    const alreadyExists = prevUsers.some(item => item._id === user._id);

    if (!alreadyExists) {
      return [...prevUsers, user];
    }

    return prevUsers;
  })

  try {
    await axios.post(addContacts, {
      myId: currentUser._id,
      contactId: user._id
    });

  } catch(err) {
    console.log(err)
  }
};

useEffect(() => {
  if (!currentUser || !currentUser._id) return;

  const callContacts = async () => {
    try {
      const result = await axios.get(`${getContacts}/${currentUser._id}`);
      setUsers([...result.data.contacts, ...result.data.groups]);
    } catch (err) {
      console.log(err);
    }
  };

  callContacts();

  socket.on('refresh-contacts', callContacts);

  return () => {
    socket.off('refresh-contacts', callContacts);
  };
}, [currentUser]);


const logOut = (evt) => {
  evt.preventDefault();
  navigate('/logout')
}

const changeActivate = (value) => {
  setInputActivate(value)
}

const changeMode = () => {
  const newMode = !pageMode;
  setPageMode(newMode);
  localStorage.setItem('pageMode', newMode); 
  changeModePage(newMode); 
};

useEffect(() => {
  pageMode ? 
     document.querySelector('body').classList.add('dark-mode')
     :
     document.querySelector('body').classList.remove('dark-mode')
},[pageMode]);

const handleContextMenu = ( e, contactId ) => {
  e.preventDefault();
  setMenuInfo({ visible: true, x: e.pageX + 300, y: e.pageY, contactId })
}

const handleCloseMenu = () => {
  setMenuInfo({ ...menuInfo, visible: false });
};

const handleDelete = async(id) => {
  handleCloseMenu();
  setUsers((prevItems) => prevItems.filter((item) => item._id !== id))
  try {
    await axios.delete(deleteContacts, {
     data: {
      myId: currentUser._id,
      contactId: id
     }
    });
  }catch(err) {
    console.log(err)
  }
};

const body = document.querySelector('body');

const navigateToProfile = () => {
  navigate(`/profile?avatarImg=${avatarImg}`);
  body.classList.remove('activeSection');
};

const toGroup = () => {
  getGroupBool(true);
  document.querySelector('body').classList.add('messageActive')
  body.classList.remove('activeSection');
}

  return (
    <section className='mainConversationSection' id="mainSection">
        <section className='FirstSection'>
          <section className='sectionMenu' id='sectionMenu'>
             <span className='firstSectionMenuPart'>
              <button className='logoutBtn' onClick={logOut}>
                  <img src={`${pageMode ? './messageIcons/logout-light.png' : './messageIcons/logout-dark.png'}`} loading='lazy'/>
                  <img src='./messageIcons/logout-light.png' loading='lazy'/>
                </button>
              <div className='userInfoDiv'
                    onClick={navigateToProfile}>

                  <span className='avatarImgSpan'>
                    <img src={avatarImg}/>
                  </span>
                <h2>{ username }</h2>
              </div>
             </span>
            <span className='menuSectionItemMode'>
              <div onClick={changeMode}>
                <div>
                  <img src={`${pageMode ? './messageIcons/sun.png' : './messageIcons/moon.png'}`} loading='lazy'/>
                </div>
                <h2>{pageMode ? 'Light mode' : 'Dark mode' }</h2>
              </div>
            </span>
            <span 
              className='menuSectionItem'
              onClick={navigateToProfile}>

              <img src={`${pageMode ? './messageIcons/myMenuImages/profileLight.png' : './messageIcons/myMenuImages/profile.png' }`}/>
              <p>My Profile</p>
            </span>
            <span 
              className='menuSectionItem group' 
              onClick={toGroup}>

              <img src={`${pageMode ? './messageIcons/myMenuImages/groupLight.png' : './messageIcons/myMenuImages/group.png' }`}/>
              <p>New Group</p>
            </span>
          </section>
          <section className='sectionItems'>
            <div className={`TopMenuAndSearchUsers  ${inputActivate ? 'hideBars' : ''}`}
                 id='TopMenuAndSearchUsers'>
              <div className='menuBurgerDiv' id="menuBurgerDiv" onClick={() => document.body.classList.add('activeSection')}>
                    <span/>
                    <span/>
                    <span/>
                </div>
                
                <h1 className='talkTitle'>
                  {
                    onlineUsers.includes(currentUser._id) ? 'TalkPad' : 'Connecting...'
                  }
                </h1>
              <form className='SearchUsers' 
                    id='SearchUsers'
                    onSubmit={e => e.preventDefault()}>
                <input 
                  placeholder="Search..." 
                  className='SearchUsersInput'
                  value={searchValue}
                  onChange={changeSend}
                  id='inputSearch'
                  ref={toActivateInput}/>

                <div className='searchIconBtn'
                     onClick={() => viewSearch()}>
                  <img src='./messageIcons/search.png' 
                      loading='lazy'
                      className='searchIcon'/>
                </div>
              </form>

              <footer className='chatsFooter'>
                <span>
                  Chats
                </span>
                <span>
                  Private chats
                </span>
              </footer>
            </div>
          
              {
              inputActivate ? 
              <Search contacts={contacts}
                      changeChat={changeChat}
                      addUsers={addUsers}
                      changeActivate={changeActivate}
                      pageMode={pageMode}/>
              :
                <section className="userItemsSection">
                  {   
                    <>
                    {(users || []).map((contact,index) => {
                            return (
                              <ConvertContacts 
                                username={contact.username} 
                                handleCheck={handleCheck}
                                select={selected}
                                index={index}
                                contact={contact}
                                key={index}
                                onContextMenu={handleContextMenu}
                                avatarImg={contact.avatarImg}
                                currentUser={currentUser}
                              />
                            )
                          })}

                      {menuInfo.visible && (
                        <ConvertsMenu
                          x={menuInfo.x}
                          y={menuInfo.y}
                          onClose={handleCloseMenu}
                          onDelete={() => handleDelete(menuInfo.contactId)}
                        />
                      )}
                      </>
                    }
                </section>
              }
          </section>
        </section>
    </section>
  )
}

export default Conversation