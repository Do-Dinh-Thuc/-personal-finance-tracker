import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/authContext';
import Button from '../Button/Button';

const EditProfile = ({ isOpen, onClose }) => {
    const { user, updateProfile, error, setError } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        picture: user?.picture || ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const result = await updateProfile(formData);
            if (result.success) {
                onClose();
            }
        } catch (error) {
            console.error('Profile update error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    picture: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <Overlay onClick={onClose} />
            <Modal>
                <ModalHeader>
                    <h2>
                        <i className="fa-solid fa-user-edit"></i>
                        Edit Profile
                    </h2>
                    <CloseButton onClick={onClose}>
                        <i className="fa-solid fa-times"></i>
                    </CloseButton>
                </ModalHeader>

                <ModalContent>
                    <Form onSubmit={handleSubmit}>
                        {error && <ErrorMessage>{error}</ErrorMessage>}

                        <ProfilePictureSection>
                            <ProfilePicture>
                                <img 
                                    src={formData.picture || '/img/avatar.png'} 
                                    alt="Profile" 
                                />
                            </ProfilePicture>
                            <UploadButton>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    id="profile-upload"
                                />
                                <label htmlFor="profile-upload">
                                    <i className="fa-solid fa-camera"></i>
                                    Change Photo
                                </label>
                            </UploadButton>
                        </ProfilePictureSection>

                        <InputGroup>
                            <Label>Full Name</Label>
                            <Input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter your full name"
                            />
                        </InputGroup>

                        <InputGroup>
                            <Label>Email Address</Label>
                            <Input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter your email"
                                disabled={user?.loginType === 'google'}
                            />
                            {user?.loginType === 'google' && (
                                <DisabledNote>
                                    <i className="fa-brands fa-google"></i>
                                    Email cannot be changed for Google accounts
                                </DisabledNote>
                            )}
                        </InputGroup>

                        <ButtonGroup>
                            <CancelButton type="button" onClick={onClose}>
                                Cancel
                            </CancelButton>
                            <SaveButton type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <i className="fa-solid fa-spinner fa-spin"></i>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <i className="fa-solid fa-save"></i>
                                        Save Changes
                                    </>
                                )}
                            </SaveButton>
                        </ButtonGroup>
                    </Form>
                </ModalContent>
            </Modal>
        </>
    );
};

// Styled Components
const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: 2000;
`;

const Modal = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border-radius: 24px;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    z-index: 2001;
    animation: modalSlideIn 0.3s ease;

    @keyframes modalSlideIn {
        from {
            opacity: 0;
            transform: translate(-50%, -60%);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%);
        }
    }
`;

const ModalHeader = styled.div`
    padding: 2rem 2rem 1rem 2rem;
    border-bottom: 1px solid #e9ecef;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
        color: var(--primary-color);
        margin: 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;

        i {
            color: #667eea;
        }
    }
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #999;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.3s ease;

    &:hover {
        background: #f5f5f5;
        color: #333;
    }
`;

const ModalContent = styled.div`
    padding: 2rem;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const ErrorMessage = styled.div`
    background: #fed7d7;
    color: #c53030;
    padding: 0.75rem;
    border-radius: 8px;
    font-size: 0.875rem;
    text-align: center;
`;

const ProfilePictureSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
`;

const ProfilePicture = styled.div`
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    border: 4px solid #e9ecef;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

const UploadButton = styled.div`
    input {
        display: none;
    }

    label {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: #667eea;
        color: white;
        border-radius: 20px;
        cursor: pointer;
        font-size: 0.875rem;
        transition: all 0.3s ease;

        &:hover {
            background: #5a67d8;
            transform: translateY(-2px);
        }
    }
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const Label = styled.label`
    font-weight: 600;
    color: var(--primary-color);
    font-size: 0.9rem;
`;

const Input = styled.input`
    padding: 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 1rem;
    transition: all 0.3s ease;

    &:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    &:disabled {
        background: #f7fafc;
        color: #a0aec0;
        cursor: not-allowed;
    }
`;

const DisabledNote = styled.div`
    font-size: 0.8rem;
    color: #666;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    i {
        color: #4285f4;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
`;

const CancelButton = styled.button`
    flex: 1;
    padding: 1rem;
    background: transparent;
    color: #666;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background: #f7fafc;
        border-color: #cbd5e0;
    }
`;

const SaveButton = styled.button`
    flex: 1;
    padding: 1rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

    &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;

export default EditProfile;