import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/authContext';

const Settings = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const [localSettings, setLocalSettings] = useState({
        notifications: true,
        emailAlerts: false,
        autoBackup: true,
        twoFactor: false
    });
    const [isLoading, setIsLoading] = useState(false);

    // Load settings from localStorage when modal opens
    useEffect(() => {
        if (isOpen) {
            try {
                const savedSettings = localStorage.getItem('userSettings');
                if (savedSettings) {
                    const parsedSettings = JSON.parse(savedSettings);
                    setLocalSettings({
                        notifications: parsedSettings.notifications || true,
                        emailAlerts: parsedSettings.emailAlerts || false,
                        autoBackup: parsedSettings.autoBackup || true,
                        twoFactor: parsedSettings.twoFactor || false
                    });
                }
            } catch (error) {
                console.error('Error loading settings:', error);
            }
        }
    }, [isOpen]);

    const handleToggle = (setting) => {
        setLocalSettings(prev => ({
            ...prev,
            [setting]: !prev[setting]
        }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        
        try {
            // Save settings to localStorage
            localStorage.setItem('userSettings', JSON.stringify(localSettings));
            
            // Show success message
            setTimeout(() => {
                alert('Settings saved successfully!');
                onClose();
            }, 500);
            
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <Overlay onClick={handleCancel} />
            <Modal>
                <ModalHeader>
                    <h2>
                        <i className="fa-solid fa-cog"></i>
                        Settings
                    </h2>
                    <CloseButton onClick={handleCancel}>
                        <i className="fa-solid fa-times"></i>
                    </CloseButton>
                </ModalHeader>

                <ModalContent>
                    <SettingsSection>
                        <SectionTitle>
                            <i className="fa-solid fa-bell"></i>
                            Notifications
                        </SectionTitle>
                        
                        <SettingItem>
                            <SettingInfo>
                                <SettingLabel>Push Notifications</SettingLabel>
                                <SettingDesc>Receive notifications about your finances</SettingDesc>
                            </SettingInfo>
                            <Toggle 
                                active={localSettings.notifications}
                                onClick={() => handleToggle('notifications')}
                            >
                                <ToggleSlider active={localSettings.notifications} />
                            </Toggle>
                        </SettingItem>

                        <SettingItem>
                            <SettingInfo>
                                <SettingLabel>Email Alerts</SettingLabel>
                                <SettingDesc>Get budget alerts via email</SettingDesc>
                            </SettingInfo>
                            <Toggle 
                                active={localSettings.emailAlerts}
                                onClick={() => handleToggle('emailAlerts')}
                            >
                                <ToggleSlider active={localSettings.emailAlerts} />
                            </Toggle>
                        </SettingItem>
                    </SettingsSection>

                    <SettingsSection>
                        <SectionTitle>
                            <i className="fa-solid fa-shield-halved"></i>
                            Security & Privacy
                        </SectionTitle>
                        
                        <SettingItem>
                            <SettingInfo>
                                <SettingLabel>Two-Factor Authentication</SettingLabel>
                                <SettingDesc>Add extra security to your account</SettingDesc>
                            </SettingInfo>
                            <Toggle 
                                active={localSettings.twoFactor}
                                onClick={() => handleToggle('twoFactor')}
                            >
                                <ToggleSlider active={localSettings.twoFactor} />
                            </Toggle>
                        </SettingItem>

                        <SettingItem>
                            <SettingInfo>
                                <SettingLabel>Auto Backup</SettingLabel>
                                <SettingDesc>Automatically backup your financial data</SettingDesc>
                            </SettingInfo>
                            <Toggle 
                                active={localSettings.autoBackup}
                                onClick={() => handleToggle('autoBackup')}
                            >
                                <ToggleSlider active={localSettings.autoBackup} />
                            </Toggle>
                        </SettingItem>
                    </SettingsSection>

                    <PreviewSection>
                        <PreviewTitle>
                            <i className="fa-solid fa-eye"></i>
                            Settings Preview
                        </PreviewTitle>
                        <PreviewGrid>
                            <PreviewItem>
                                <PreviewLabel>Notifications:</PreviewLabel>
                                <PreviewValue className={localSettings.notifications ? 'enabled' : 'disabled'}>
                                    {localSettings.notifications ? '🔔 Enabled' : '🔕 Disabled'}
                                </PreviewValue>
                            </PreviewItem>
                            <PreviewItem>
                                <PreviewLabel>Email Alerts:</PreviewLabel>
                                <PreviewValue className={localSettings.emailAlerts ? 'enabled' : 'disabled'}>
                                    {localSettings.emailAlerts ? '📧 Enabled' : '📧 Disabled'}
                                </PreviewValue>
                            </PreviewItem>
                            <PreviewItem>
                                <PreviewLabel>Auto Backup:</PreviewLabel>
                                <PreviewValue className={localSettings.autoBackup ? 'enabled' : 'disabled'}>
                                    {localSettings.autoBackup ? '💾 Enabled' : '💾 Disabled'}
                                </PreviewValue>
                            </PreviewItem>
                            <PreviewItem>
                                <PreviewLabel>Two-Factor Auth:</PreviewLabel>
                                <PreviewValue className={localSettings.twoFactor ? 'enabled' : 'disabled'}>
                                    {localSettings.twoFactor ? '🔐 Enabled' : '🔐 Disabled'}
                                </PreviewValue>
                            </PreviewItem>
                        </PreviewGrid>
                    </PreviewSection>

                    <ButtonGroup>
                        <CancelButton onClick={handleCancel}>
                            <i className="fa-solid fa-times"></i>
                            Cancel
                        </CancelButton>
                        <SaveButton onClick={handleSave} disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <i className="fa-solid fa-spinner fa-spin"></i>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-save"></i>
                                    Save Settings
                                </>
                            )}
                        </SaveButton>
                    </ButtonGroup>
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
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    z-index: 2001;
    border: 2px solid #e9ecef;
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
        color: #222260;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1.5rem;

        i {
            color: #ffa500;
        }
    }
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #666;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.3s ease;

    &:hover {
        background: rgba(255, 165, 0, 0.1);
        color: #ffa500;
        transform: scale(1.1);
    }
`;

const ModalContent = styled.div`
    padding: 2rem;
`;

const SettingsSection = styled.div`
    margin-bottom: 2.5rem;
`;

const SectionTitle = styled.h3`
    color: #222260;
    margin-bottom: 1.5rem;
    font-size: 1.2rem;
    border-bottom: 2px solid #e9ecef;
    padding-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    i {
        color: #667eea;
    }
`;

const SettingItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 0;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
        border-bottom: none;
    }
`;

const SettingInfo = styled.div`
    flex: 1;
    margin-right: 1rem;
`;

const SettingLabel = styled.div`
    font-weight: 600;
    color: #222260;
    margin-bottom: 0.25rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
`;

const SettingDesc = styled.div`
    font-size: 0.875rem;
    color: #666;
    opacity: 0.8;
    line-height: 1.4;
`;

const Toggle = styled.button`
    width: 50px;
    height: 26px;
    border-radius: 13px;
    border: none;
    background: ${props => props.active ? '#667eea' : '#e2e8f0'};
    cursor: pointer;
    position: relative;
    transition: all 0.3s ease;
    flex-shrink: 0;

    &:hover {
        transform: scale(1.05);
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
    }
`;

const ToggleSlider = styled.div`
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: white;
    position: absolute;
    top: 2px;
    left: ${props => props.active ? '26px' : '2px'};
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const PreviewSection = styled.div`
    background: #f8f9fa;
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    border: 2px solid #e9ecef;
`;

const PreviewTitle = styled.h4`
    color: #222260;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    i {
        color: #17a2b8;
    }
`;

const PreviewGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const PreviewItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
`;

const PreviewLabel = styled.span`
    font-size: 0.8rem;
    color: #666;
    font-weight: 500;
`;

const PreviewValue = styled.span`
    font-weight: 600;
    color: #222260;

    &.enabled {
        color: #4CAF50;
    }

    &.disabled {
        color: #ff4757;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #e9ecef;

    @media (max-width: 768px) {
        flex-direction: column;
    }
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
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

    &:hover {
        background: rgba(255, 165, 0, 0.1);
        border-color: #ffa500;
        transform: translateY(-2px);
    }
`;

const SaveButton = styled.button`
    flex: 1;
    padding: 1rem;
    background: linear-gradient(135deg, #ffa500 0%, #ff8c00 100%);
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
        box-shadow: 0 10px 20px rgba(255, 165, 0, 0.3);
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none;
    }
`;

export default Settings;