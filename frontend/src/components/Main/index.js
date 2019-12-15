import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import logo from '../../assets/logo.svg';
import like from '../../assets/like.svg';
import dislike from '../../assets/dislike.svg';
import './style.css';

export default function Main({ match }) {
    const [ users, setUsers ] = useState([]);

    useEffect(() => {

        (async function loadUsers() {
            const response = await api.get("/devs", {
                headers: {
                    user: match.params.id,
                }
            });

            setUsers(response.data);
        })();

    }, [match.params.id]);

    async function handleLike(id) {
        await api.post(`/devs/${id}/likes`, null, {
            headers: { user: match.params.id },
        })
        
        setUsers(users.filter(user => user._id !== id));
    }

    async function handleDislike(id) {
        await api.post(`/devs/${id}/dislikes`, null, {
            headers: { user: match.params.id },
        })
        
        setUsers(users.filter(user => user._id !== id));
    }

    return (
        <div className="main-container">
            <Link to="/">
                <img src={logo} alt="Tindev" />
            </Link>
            { users.length > 0 ? (
                <ul>
                    { users.map(user => {
                        return (
                            <li key={user._id}>
                                <img src={user.avatar} alt={user.name} />
                                <footer>
                                    <strong>{user.name}</strong>
                                    <p>{user.bio ? user.bio : "No description provided."}</p>
                                </footer>
                                <div className="buttons">
                                    <button type="button" onClick={() => handleDislike(user._id)}>
                                        <img src={dislike} alt="Dislike" />
                                    </button>
                                    <button type="button" onClick={() => handleLike(user._id)}>
                                        <img src={like} alt="Like" />
                                    </button>
                                </div>
                            </li>
                        )
                    }
                    )}
                </ul>
            ) : (
                <div className="empty">
                    <h4>At the moment there are no more registered devs :/</h4>
                </div>
            ) }
        </div>
    );
}