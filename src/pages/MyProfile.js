import React from 'react'
import '../css/myProfile.css'
import { useNavigate } from 'react-router-dom'
import { profileFile } from './utils/apiRoute.js'
import axios from 'axios'
import { useLocation } from 'react-router-dom'

function MyProfile() {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const avatarImg = searchParams.get("avatarImg");

    const currentUser = JSON.parse(localStorage.getItem("chat-user-Item"));

    const handleFileChange = async (e) => {
            
      const file = e.target.files[0];
      if (!file) return;
    
      const formData = new FormData();
      formData.append("avatar", file);
      formData.append("userId", currentUser._id);
    
      try {
        await axios.post(profileFile, formData); 

        navigate('/')
      } catch (err) {
        console.log(err);
      }
    };
    
    
  return (
    <section className='profileSection'>
        <section className='profileMenu'>
            <span className='topbarSpan'>
                <h2>My Profile</h2>
                <span className='exitBtnSpan'
                     onClick={() => navigate('/')}/>
            </span>

            <footer className='profileInfoFooter'>
            <label className='profileInfoLabel' htmlFor='file'>
              <span className='avatar'>
                <img src={avatarImg}/>
              </span>
                
                <span className='editPartSpan'>
                  <h2 className='nameTitle'>
                    { currentUser.username }
                  </h2>
                  <p>Online</p>
                </span>

                <input
                  type='file'
                  id='file'
                  style={{ display: 'none' }}
                  accept="image/jpg, image/png, image/jpeg"
                  onChange={handleFileChange}/>
              </label>
            </footer>
        </section>
    </section>
  )
}

export default MyProfile