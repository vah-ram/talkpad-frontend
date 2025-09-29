import React,{ useEffect,useRef } from 'react';
import '../ConvertUsers/ConvertUsers.css'

function ConvertsMenu({ x, y, onDelete, onClose }) {
    const menuRef = useRef();

    useEffect(() => {
        const handleCloseMenu = (e) => {
            if(!menuRef.current || !e.target || !menuRef.current.contains(e.target)) {
                onClose()
            }
        }

        document.addEventListener('click', handleCloseMenu);
    }, []);
  return (
    <div 
    className='menuDiv' 
    ref={menuRef}
    style={{
        top: `${y}px`,
        left: `${x}px`
    }}>
        <span 
        className='deleteSpan'
        onClick={onDelete}>
            <img src='./messageIcons/delete.png'/>
            <p>Delete chat</p>
        </span>
    </div>
  )
}

export default ConvertsMenu