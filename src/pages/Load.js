import React,{ useEffect } from 'react'
import '../css/load.css'
import { useNavigate } from 'react-router-dom'

function Load() {
    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem('loaded')) {
            navigate('/')
        } else {
            setTimeout(() => {
                navigate('/');
                localStorage.setItem('loaded', true)
            }, 4000);
        }
    }, []);

  return (
    <section className='loadSection'>
        <div className='loadingDiv'>
            <div>
                <span/>
            </div>
            <h2>Loading.<span>.</span><span>.</span></h2>
        </div>
    </section>
  )
}

export default Load