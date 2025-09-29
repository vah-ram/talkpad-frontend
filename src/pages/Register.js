import React, { useState,useEffect } from 'react'
import '../css/register.css'
import { Link,useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast,Toaster } from 'sonner'
import { registerHost } from './utils/apiRoute'
import { useGoogleLogin } from "@react-oauth/google"

function Register() {
    const navigate = useNavigate();

    const [ show,setShow ] = useState(false)
    const [ showCorrect,setShowCorrect ] = useState(false)
    const [ username,setUsername ] = useState('')
    const [ email,setEmail ] = useState('')
    const [ password,setPassword ] = useState('')
    const [ correctPassword,setCorrectPassword ] = useState('')

        useEffect(() => {
            if(localStorage.getItem('chat-user-Item')) {
                navigate('/')
            }
        },[])

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
            const {data} = await axios.post( registerHost,
                {
                    username,
                    email,
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

    const handleGoogleSubmit = async({ username, email, password }) => {
        const {data} = await axios.post( registerHost,
            {
                username,
                email,
                password
            }
        );
        
        if(data.status === true) {
                localStorage.setItem('chat-user-Item', JSON.stringify(data.user))
                navigate('/api/loading')
        }
    }

    const handleValidaton = () => {
        
        if (password !== correctPassword) {
            toast.error('Your password and correct password!',
                toastOptions);
            return false;
        }
        else if (username.length < 3) {
            toast.error('Your username will be must 3 characters!',
                toastOptions)
            return false;
        } else if (email.length < 11) {
            toast.error('Please write your real email!',
                toastOptions)
            return false;
        } else if (password.length < 8) {
            toast.error('Your password will be must 8 characters!',
                toastOptions)
            return false;
        }
        return true
    }

    const register = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
          try {
            const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`,
              },
            });
    
            const googleUsername = userInfo.data.given_name;
            const googleEmail = userInfo.data.email;
    
            handleGoogleSubmit({
              username: googleUsername,
              email: googleEmail,
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
            <form className='formInput' onSubmit={handleSubmit}>
                <div className='titleInput'>
                        <h1>Sign up</h1>
                </div>

                <span>
                    <label for="usernameInput">* Username</label>
                        <input
                            type='text'
                            placeholder='Write username...'
                            onChange={e => setUsername(e.target.value)}
                            id='usernameInput'
                        />
                </span>
                <span>
                    <label for="emailInput">* Email</label>
                    <input
                        type='email'
                        placeholder='Write email...'
                        onChange={e => setEmail(e.target.value)}
                        id='emailInput'
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

                <span>
                    <label for="passCorrectInput">* Correct Password</label>
                    <div className='passwordInput'>
                        <input
                            type={showCorrect ? 'text' : 'password'}
                            placeholder='Write password...'
                            onChange={e => setCorrectPassword(e.target.value)}
                            id="passCorrectInput"
                        />
                        <div id='eyeDiv' 
                            onClick={() => setShowCorrect(!showCorrect)}>
                            <img src={showCorrect ? './messageIcons/hide.png' : './messageIcons/eye.png'}/>
                        </div>
                    </div>
                </span>

                <button onClick={register} className="my-google-btn">
                    <img src="/messageIcons/google.webp" alt="" />
                    <p>Sign up with Google</p>
                </button>

                <button
                 className='inputBtn'
                 type='submit'
                 onSubmit={handleSubmit}>
                    Sign up
                </button>

                <p className='bottomLink'>
                    Already have an account.
                     <Link
                     to='/login'
                     className='link'
                     >Sign in</Link>
                </p>
            </form>
            </div>

        <Toaster richColors/>
    </>
  )
}

export default Register