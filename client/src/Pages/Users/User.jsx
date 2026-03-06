import React from 'react';
import { Link } from 'react-router-dom';

import './Users.css';
import Avatar from '../../components/Avatar/Avatar';

const User = ({ user }) => {
    return (
        <Link to={`/Users/${user._id}`} className="user-profile-link">
            <Avatar seed={user.name} px="12px" py="7px" borderRadius="50%" color="white">
                {user.name.charAt(0).toUpperCase()}
            </Avatar>
            <h5>{user.name}</h5>
        </Link>
    );
};

export default User;
