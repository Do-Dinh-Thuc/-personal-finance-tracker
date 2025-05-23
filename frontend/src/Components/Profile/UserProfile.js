import React, { useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';
import Button from '../Button/Button';

function UserProfile() {
    const { user, updateProfile, error, setError, loading } = useGlobalContext();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || ''
    });

    const handleChange = (field) => (e) => {
        setFormData({ ...formData, [field]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.email) {
            setError('All fields are required!');
            return;
        }

        const success = await updateProfile(formData);
        if (success) {
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            email: user?.email || ''
        });
        setIsEditing(false);
        setError('');
    };

    return (
        <ProfileStyled>
            <InnerLayout>
                <h1>User Profile</h1>
                
                <div className="profile-content">
                    <div className="profile-card">
                        <div className="avatar-section">
                            <div className="avatar">
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <h2>{user?.name || 'User'}</h2>
                            <p>{user?.email || 'No email'}</p>
                        </div>

                        {error && <p className="error">{error}</p>}

                        {!isEditing ? (
                            <div className="profile-info">
                                <div className="info-group">
                                    <label>Full Name:</label>
                                    <span>{user?.name || 'Not set'}</span>
                                </div>
                                <div className="info-group">
                                    <label>Email:</label>
                                    <span>{user?.email || 'Not set'}</span>
                                </div>
                                <div className="info-group">
                                    <label>Member Since:</label>
                                    <span>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</span>
                                </div>
                                
                                <Button
                                    name="Edit Profile"
                                    bPad={'.8rem 1.6rem'}
                                    bRad={'30px'}
                                    bg={'var(--color-accent'}
                                    color={'#fff'}
                                    onClick={() => setIsEditing(true)}
                                />
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="edit-form">
                                <div className="input-control">
                                    <label>Full Name:</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange('name')}
                                        disabled={loading}
                                    />
                                </div>
                                
                                <div className="input-control">
                                    <label>Email:</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange('email')}
                                        disabled={loading}
                                    />
                                </div>

                                <div className="button-group">
                                    <Button
                                        name={loading ? 'Updating...' : 'Save Changes'}
                                        bPad={'.8rem 1.6rem'}
                                        bRad={'30px'}
                                        bg={'var(--color-green'}
                                        color={'#fff'}
                                        disabled={loading}
                                    />
                                    <Button
                                        name="Cancel"
                                        bPad={'.8rem 1.6rem'}
                                        bRad={'30px'}
                                        bg={'var(--color-grey'}
                                        color={'#fff'}
                                        onClick={handleCancel}
                                        disabled={loading}
                                    />
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </InnerLayout>
        </ProfileStyled>
    );
}

const ProfileStyled = styled.div`
    .profile-content {
        display: flex;
        justify-content: center;
        margin-top: 2rem;
    }

    .profile-card {
        background: #FCF6F9;
        border: 2px solid #FFFFFF;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        border-radius: 20px;
        padding: 2rem;
        width: 100%;
        max-width: 500px;
    }

    .avatar-section {
        text-align: center;
        margin-bottom: 2rem;

        .avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: var(--color-accent);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            font-weight: bold;
            margin: 0 auto 1rem;
        }

        h2 {
            margin: 0 0 0.5rem;
            color: var(--primary-color);
        }

        p {
            margin: 0;
            color: rgba(34, 34, 96, 0.6);
        }
    }

    .profile-info {
        .info-group {
            display: flex;
            justify-content: space-between;
            padding: 1rem 0;
            border-bottom: 1px solid rgba(34, 34, 96, 0.1);

            label {
                font-weight: 600;
                color: var(--primary-color);
            }

            span {
                color: rgba(34, 34, 96, 0.8);
            }
        }

        button {
            margin-top: 2rem;
            width: 100%;
        }
    }

    .edit-form {
        .input-control {
            margin-bottom: 1.5rem;

            label {
                display: block;
                margin-bottom: 0.5rem;
                font-weight: 600;
                color: var(--primary-color);
            }

            input {
                width: 100%;
                padding: 0.8rem 1rem;
                border: 2px solid #fff;
                border-radius: 5px;
                background: transparent;
                box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
                color: rgba(34, 34, 96, 0.9);
                font-family: inherit;
                font-size: inherit;
                outline: none;

                &:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
            }
        }

        .button-group {
            display: flex;
            gap: 1rem;

            button {
                flex: 1;
            }
        }
    }

    .error {
        color: red;
        text-align: center;
        margin-bottom: 1rem;
        animation: shake 0.5s ease-in-out;
    }
`;

export default UserProfile;