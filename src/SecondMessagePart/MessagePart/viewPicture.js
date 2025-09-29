import React from 'react'
import './viewPicture.css'

function ViewPicture({ imageUrl, closeSelectedImage }) {
  return (
    <section className='pictureSection'>
    <span className='exitBtn' onClick={() => {
        closeSelectedImage()
    }}/>

    <img src={imageUrl}/>
    </section>
  )
}

export default ViewPicture