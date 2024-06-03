import React, {useContext} from 'react'

import { AuthenticationContext } from '../../Context/authContext';
import './NavLinks.css';
import {NavLink} from 'react-router-dom';

const NavLinks = (props) => {

    const auth = useContext(AuthenticationContext);

  return (
    <ul className='nav-links'>
        <li>
            <NavLink to="/" exact="true">All Users</NavLink>
        </li>
        {auth.isLoggedIn && (<li>
            <NavLink to={`/${auth.userId}/places`} exact="true">My places</NavLink>
        </li>)}
        {auth.isLoggedIn && (<li>
            <NavLink to="/places/new" exact="true">Add Place</NavLink>
        </li>)}
        {!auth.isLoggedIn && (<li>
            <NavLink to="/auth" exact="true">Authenticate</NavLink>
        </li>)}
        {auth.isLoggedIn && (<li>
            <button  onClick={auth.logout}>LOGOUT</button>
        </li>)}
    </ul>
  )
}

export default NavLinks