import React, { useEffect, useState } from 'react'
import '../css/register.css'
import { Link,useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast,Toaster } from 'sonner'
import { loginHost } from './utils/apiRoute'
import { useGoogleLogin } from "@react-oauth/google"

function Login() {
    const navigate = useNavigate();

    const [ show,setShow ] = useState(false)
    const [ username,setUsername ] = useState('')
    const [ password,setPassword ] = useState('')

    useEffect(() => {
        if(localStorage.getItem('chat-user-Item')) {
            navigate('/')
        }
    },[]);

    const toastOptions = {
        position: 'bottom-right',
        autoClose: 800,
        theme: 'light',
        ontouchmove: true,
        draggable: true
    };

    const handleSubmit = async(evt) => {
        evt.preventDefault();
        if(handleValidaton()) {
            const {data} = await axios.post( loginHost,
                {
                    username,
                    password
                }
            );

            if(data.status === false) {
                toast.error(data.msg,
                    toastOptions);
            }
            if(data.status === true) {
                toast.success(data.msg,
                    toastOptions);

                    localStorage.setItem('chat-user-Item', JSON.stringify(data.user))
                    navigate('/api/loading')
            }
        };
    };

    const handleGoogleSubmit = async({ username, password }) => {
            const {data} = await axios.post( loginHost,
                {
                    username,
                    password
                }
            );

            if(data.status === true) {
                    localStorage.setItem('chat-user-Item', JSON.stringify(data.user))
                    navigate('/api/loading')
            }
    };

    const handleValidaton = () => {
        
        if (username === '') {
            toast.error('Please write your username!',
                toastOptions)
            return false;
        }else if (password === '') {
            toast.error('Please write your password!',
                toastOptions)
            return false;
        }
        return true
    }

    const login = useGoogleLogin({
            onSuccess: async (tokenResponse) => {
              try {
                const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: {
                    Authorization: `Bearer ${tokenResponse.access_token}`,
                  },
                });
        
                const googleUsername = userInfo.data.given_name;
        
                handleGoogleSubmit({
                  username: googleUsername,
                  password: "Google_Auth_" + userInfo.data.sub
                });
              } catch (err) {
                console.error("Google login error:", err);
              }
            },
            onError: () => console.log('Login Failed')
          });
    
  return (
    <>
        <div className='allDiv'>
            <form className='formInput loginform' onSubmit={handleSubmit}>
                <div className='titleInput'>
                        <h1>Sign in</h1>
                </div>

                <span>
                    <label for="usernameInput">* Username</label>
                    <input
                        type='text'
                        placeholder='Write username...'
                        onChange={e => setUsername(e.target.value)}
                        id="usernameInput"
                    />
                </span>

                <span>
                    <label for="passInput">* Password</label>
                    <div className='passwordInput'>
                        <input
                            type={show ? 'text' : 'password'}
                            placeholder='Write password...'
                            onChange={e => setPassword(e.target.value)}
                            id="passInput"
                        />
                        <div id='eyeDiv' 
                            onClick={() => setShow(!show)}>
                            <img src={show ? './messageIcons/hide.png' : './messageIcons/eye.png'}/>
                        </div>
                    </div>
                </span>

                <div class="checkboxWrapper">
                    <label class="customCheckbox">
                        <input type="checkbox" 
                               id="loggedInCheckBoxInput"/>
                        <span class="checkmark"></span>
                        Keep me logged in
                    </label>
                </div>

                <button onClick={login} className="my-google-btn">
                    <img src="/messageIcons/google.webp" alt="" />
                    <p>Sign in with Google</p>
                </button>

                <button
                 className='inputBtn'
                 type='submit'
                 onSubmit={handleSubmit}>
                    Sign in
                </button>

                <p className='bottomLink'>
                    Don't have an account. 
                     <Link
                     to='/register'
                     className='link'
                     >Sign up</Link>
                </p>
            </form>
            </div>

        <Toaster richColors/>
    </>
  )
}

export default Login