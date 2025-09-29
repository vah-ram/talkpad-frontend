import React,{ useState, useEffect, useRef } from 'react'
import '../css/groupPart.css'
import { addGroup } from './utils/ConvertRouter.js'
import axios from 'axios';
import socket from '../pages/Socket.js'
import { Toaster, toast } from 'sonner'

function GroupPart({ getGroupBool, currentUser }) {

    const activeInput = useRef();
    const [ groupName,setGroupName ] = useState('');

    useEffect(() => {
        activeInput.current.focus()
    });

    const toastOptions = {
        duration: 5000,
        position: 'bottom-right',
        closeButton: true
    }

    const sendValues = async() => {
        setGroupName('')
        try {
            if(checkInput()) {

            const group = await axios.post(addGroup, {
                username: groupName,
                admin: currentUser._id
            });
        
            if(group.data.status) {
                exitGroupCreatingPage()
            }else {
                toast.error( group.data.message, toastOptions)
            }
        }
        } catch(err) {
            console.log(err)
        }

        socket.emit("refresh-contacts");
    }

    const checkInput = () => {
        if(groupName.length < 3) {
            toast.error("Group name must be at least 4 characters long.", toastOptions);
              return false;
        }else {
            return true;
        }
    }

    function exitGroupCreatingPage() {
        getGroupBool(false)
        document.querySelector('body').classList.remove('messageActive')
    }

  return (
    <section className='groupSection'>
        <div className='groupCreatePart'>
            <div className='integerValuesPart'>
                <span>
                    
                </span>
                <span>
                    <label for='groupInput'>
                        Group name
                    </label>
                    <input 
                        type='text' 
                        id='groupInput' 
                        value={groupName}
                        ref={activeInput}
                        onChange={(e) => setGroupName(e.target.value)}/>
                </span>
            </div>

            <div className='bottomBtnsDiv'>
                <div>
                    <button onClick={exitGroupCreatingPage}>Cancel</button>
                        <button onClick={sendValues}>Next</button>
                </div>
            </div>
        </div>
        <Toaster richColors/>
    </section>
  )
}

export default GroupPart