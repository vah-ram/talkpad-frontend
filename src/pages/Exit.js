import React from 'react'
import '../css/exit.css'
import { useNavigate } from 'react-router-dom'

function Exit() {
    const navigate = useNavigate();

    const stayHome = (evt) => {
        evt.preventDefault()
        navigate('/')
    }

    const ExitHome = (evt) => {
        evt.preventDefault()
        localStorage.removeItem('loaded');
        localStorage.removeItem('chat-user-Item');
        navigate('/login')
    }
  return (
    <section className='sectionExit'>
        <span className='exitSpan'>
            <h1>Are you sure you want to logout?</h1>
            <div>
                <button onClick={stayHome}>
                    Stay
                </button>
                <button onClick={ExitHome}>
                    Logout
                </button>
            </div>
        </span> 
    </section>
  )
}

export default Exit