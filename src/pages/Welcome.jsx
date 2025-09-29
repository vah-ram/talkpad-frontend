import React from 'react'
import '../css/welcome.css'
import helloThere from './gif/helloThere.gif'

function Welcome() {
  return (
    <section className='welcomeSection'>
        <img src={helloThere} loading='lazy'/>
        Please select chat for messaging...
    </section>
  )
}

export default Welcome