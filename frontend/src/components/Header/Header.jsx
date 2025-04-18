import React from 'react'
import './Header.css'
import { useNavigate } from 'react-router-dom'
    
const Header = () => {
    const navigate = useNavigate();
    return (
        <div className='header'>
            <div className='header-contents'>
                <h2>Shop Your Favorite Gym Gear Here</h2>
                <p>Explore a wide range of gym products, from weights to supplements, designed to elevate your fitness journey.</p>
                <button onClick={() => navigate('/products')}>View Products</button>
            </div>
        </div>
    )
}

export default Header
