import React, { useEffect, useRef, useState } from 'react'
import dropdownToggle from '../../Assets/dropdown.png'
import './Dropdown.css'
export const Dropdown = ({active, setActive, options}) => {
    const [isActive, setIsActive] = useState(false)
    const dropdownRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsActive(false);
          }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

    function onClickEvent (option) {
        setActive(option)
        setIsActive(false)
    }
  return (
    <div className="dropdown" ref={dropdownRef}>
        <div className="dropdown-btn" onClick={() => setIsActive(!isActive)}>
            <img src= {dropdownToggle} alt = ''/>
        </div>
        {isActive && (
            <div className="dropdown-content">
                {options.map(option => (
                     <div
                      key = {option}
                      className={`dropdown-item ${active === option ? "dropdown-item-active" : ""}`}
                      onClick={() => onClickEvent(option)}>
                     {option}
                 </div>
                ))}
        </div>
        )}
    </div>
  )
}
