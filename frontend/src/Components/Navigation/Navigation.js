import React, { useState } from 'react'
import styled from 'styled-components'
import avatar from '../../img/avatar.png'
import { signout } from '../../utils/Icons'
import { menuItems } from '../../utils/menuItems'
import { useAuth } from '../../context/authContext'
import { useGlobalContext } from '../../context/globalContext'

function Navigation({active, setActive}) {
    const { user, logout } = useAuth();
    const { totalIncome, totalExpenses, totalBalance, incomes, expenses } = useGlobalContext();
    const [showProfile, setShowProfile] = useState(false);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to sign out?')) {
            logout();
        }
    };

    const handleAvatarClick = () => {
        setShowProfile(!showProfile);
    };

    const closeProfile = () => {
        setShowProfile(false);
    };

    // Calculate user stats
    const totalTransactions = incomes.length + expenses.length;
    const joinDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A';
    const accountAge = user?.createdAt ? 
        Math.floor((Date.now() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)) : 0;
    
    return (
        <NavStyled>
            <div className="user-con">
                <AvatarContainer onClick={handleAvatarClick}>
                    <img src={user?.picture || avatar} alt="Profile" />
                    <StatusIndicator />
                </AvatarContainer>
                <div className="text">
                    <h2>{user?.name || 'User'}</h2>
                    <p>Your Money</p>
                </div>
            </div>

            {/* Profile Modal */}
            {showProfile && (
                <>
                    <ProfileOverlay onClick={closeProfile} />
                    <ProfileModal>
                        <ProfileHeader>
                            <ProfileAvatar>
                                <img src={user?.picture || avatar} alt="Profile" />
                                <OnlineStatus />
                            </ProfileAvatar>
                            <ProfileInfo>
                                <ProfileName>{user?.name || 'User'}</ProfileName>
                                <ProfileEmail>{user?.email || 'No email'}</ProfileEmail>
                                <ProfileBadge>
                                    <i className="fa-solid fa-crown"></i>
                                    {user?.loginType === 'google' ? 'Google User' : 'Premium User'}
                                </ProfileBadge>
                            </ProfileInfo>
                            <CloseButton onClick={closeProfile}>
                                <i className="fa-solid fa-times"></i>
                            </CloseButton>
                        </ProfileHeader>

                        <ProfileStats>
                            <StatItem>
                                <StatIcon className="balance">
                                    <i className="fa-solid fa-wallet"></i>
                                </StatIcon>
                                <StatInfo>
                                    <StatLabel>Total Balance</StatLabel>
                                    <StatValue className={totalBalance() >= 0 ? 'positive' : 'negative'}>
                                        ${Math.abs(totalBalance()).toLocaleString()}
                                    </StatValue>
                                </StatInfo>
                            </StatItem>

                            <StatItem>
                                <StatIcon className="transactions">
                                    <i className="fa-solid fa-receipt"></i>
                                </StatIcon>
                                <StatInfo>
                                    <StatLabel>Total Transactions</StatLabel>
                                    <StatValue>{totalTransactions}</StatValue>
                                </StatInfo>
                            </StatItem>

                            <StatItem>
                                <StatIcon className="time">
                                    <i className="fa-solid fa-calendar"></i>
                                </StatIcon>
                                <StatInfo>
                                    <StatLabel>Member Since</StatLabel>
                                    <StatValue>{joinDate}</StatValue>
                                </StatInfo>
                            </StatItem>
                        </ProfileStats>

                        <ProfileActions>
                            <ActionButton className="edit">
                                <i className="fa-solid fa-edit"></i>
                                Edit Profile
                            </ActionButton>
                            <ActionButton className="settings">
                                <i className="fa-solid fa-cog"></i>
                                Settings
                            </ActionButton>
                            <ActionButton className="export">
                                <i className="fa-solid fa-download"></i>
                                Export Data
                            </ActionButton>
                        </ProfileActions>

                        <ProfileAchievements>
                            <AchievementTitle>Achievements</AchievementTitle>
                            <AchievementGrid>
                                <Achievement className={totalTransactions >= 10 ? 'earned' : ''}>
                                    <AchievementIcon>
                                        <i className="fa-solid fa-star"></i>
                                    </AchievementIcon>
                                    <AchievementName>First Steps</AchievementName>
                                    <AchievementDesc>10+ Transactions</AchievementDesc>
                                </Achievement>

                                <Achievement className={totalBalance() > 1000 ? 'earned' : ''}>
                                    <AchievementIcon>
                                        <i className="fa-solid fa-trophy"></i>
                                    </AchievementIcon>
                                    <AchievementName>Saver</AchievementName>
                                    <AchievementDesc>$1000+ Balance</AchievementDesc>
                                </Achievement>

                                <Achievement className={accountAge >= 30 ? 'earned' : ''}>
                                    <AchievementIcon>
                                        <i className="fa-solid fa-medal"></i>
                                    </AchievementIcon>
                                    <AchievementName>Veteran</AchievementName>
                                    <AchievementDesc>30+ Days Active</AchievementDesc>
                                </Achievement>

                                <Achievement className={incomes.length + expenses.length >= 50 ? 'earned' : ''}>
                                    <AchievementIcon>
                                        <i className="fa-solid fa-gem"></i>
                                    </AchievementIcon>
                                    <AchievementName>Power User</AchievementName>
                                    <AchievementDesc>50+ Transactions</AchievementDesc>
                                </Achievement>
                            </AchievementGrid>
                        </ProfileAchievements>

                        <ProfileFooter>
                            <FooterButton onClick={handleLogout} className="logout">
                                <i className="fa-solid fa-sign-out-alt"></i>
                                Sign Out
                            </FooterButton>
                        </ProfileFooter>
                    </ProfileModal>
                </>
            )}

            <ul className="menu-items">
                {menuItems.map((item) => {
                    return <li
                        key={item.id}
                        onClick={() => {
                            setActive(item.id);
                            closeProfile(); // Close profile when navigating
                        }}
                        className={active === item.id ? 'active': ''}
                    >
                        {item.icon}
                        <span>{item.title}</span>
                    </li>
                })}
            </ul>
            <div className="bottom-nav">
                <li onClick={handleLogout} style={{ cursor: 'pointer' }}>
                    {signout} Sign Out
                </li>
            </div>
        </NavStyled>
    )
}

const NavStyled = styled.nav`
    padding: 2rem 1.5rem;
    width: 374px;
    height: 100%;
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #FFFFFF;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 2rem;
    position: relative;

    .user-con{
        height: 100px;
        display: flex;
        align-items: center;
        gap: 1rem;
        
        .text {
            flex: 1;
        }
        
        h2{
            color: rgba(34, 34, 96, 1);
        }
        p{
            color: rgba(34, 34, 96, .6);
        }
    }

    .menu-items{
        flex: 1;
        display: flex;
        flex-direction: column;
        li{
            display: grid;
            grid-template-columns: 40px auto;
            align-items: center;
            margin: .6rem 0;
            font-weight: 500;
            cursor: pointer;
            transition: all .4s ease-in-out;
            color: rgba(34, 34, 96, .6);
            padding-left: 1rem;
            position: relative;
            i{
                color: rgba(34, 34, 96, 0.6);
                font-size: 1.4rem;
                transition: all .4s ease-in-out;
            }
        }
    }

    .active{
        color: rgba(34, 34, 96, 1) !important;
        i{
            color: rgba(34, 34, 96, 1) !important;
        }
        &::before{
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            width: 4px;
            height: 100%;
            background: #222260;
            border-radius: 0 10px 10px 0;
        }
    }
`;

const AvatarContainer = styled.div`
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        transform: scale(1.05);
    }

    img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
        background: #fcf6f9;
        border: 3px solid #FFFFFF;
        padding: .2rem;
        box-shadow: 0px 1px 17px rgba(0, 0, 0, 0.06);
        transition: all 0.3s ease;
    }

    &:hover img {
        box-shadow: 0px 4px 25px rgba(102, 126, 234, 0.3);
        border-color: #667eea;
    }
`;

const StatusIndicator = styled.div`
    position: absolute;
    bottom: 8px;
    right: 8px;
    width: 16px;
    height: 16px;
    background: #4CAF50;
    border: 2px solid white;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const ProfileOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: 1000;
`;

const ProfileModal = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border-radius: 24px;
    padding: 0;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    z-index: 1001;
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

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 6px;
    }

    &::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 6px;
    }
`;

const ProfileHeader = styled.div`
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 2rem;
    border-radius: 24px 24px 0 0;
    position: relative;
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const ProfileAvatar = styled.div`
    position: relative;

    img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        border: 4px solid rgba(255, 255, 255, 0.3);
        object-fit: cover;
    }
`;

const OnlineStatus = styled.div`
    position: absolute;
    bottom: 4px;
    right: 4px;
    width: 20px;
    height: 20px;
    background: #4CAF50;
    border: 3px solid white;
    border-radius: 50%;
`;

const ProfileInfo = styled.div`
    flex: 1;
`;

const ProfileName = styled.h2`
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
    font-weight: 700;
`;

const ProfileEmail = styled.p`
    margin: 0 0 0.5rem 0;
    opacity: 0.8;
    font-size: 0.9rem;
`;

const ProfileBadge = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.2);
    padding: 0.3rem 0.8rem;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 500;

    i {
        color: #FFD700;
    }
`;

const CloseButton = styled.button`
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.2rem;
    transition: all 0.3s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: scale(1.1);
    }
`;

const ProfileStats = styled.div`
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const StatItem = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 16px;
    transition: all 0.3s ease;

    &:hover {
        background: #e9ecef;
        transform: translateX(4px);
    }
`;

const StatIcon = styled.div`
    width: 50px;
    height: 50px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;

    &.balance {
        background: rgba(102, 126, 234, 0.1);
        color: #667eea;
    }

    &.transactions {
        background: rgba(66, 173, 0, 0.1);
        color: var(--color-green);
    }

    &.time {
        background: rgba(255, 165, 0, 0.1);
        color: #ffa500;
    }
`;

const StatInfo = styled.div`
    flex: 1;
`;

const StatLabel = styled.div`
    font-size: 0.9rem;
    color: rgba(34, 34, 96, 0.6);
    margin-bottom: 0.2rem;
`;

const StatValue = styled.div`
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--primary-color);

    &.positive {
        color: var(--color-green);
    }

    &.negative {
        color: #ff4757;
    }
`;

const ProfileActions = styled.div`
    padding: 0 2rem;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
`;

const ActionButton = styled.button`
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: white;
    border: 2px solid #e9ecef;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1rem;
    font-weight: 500;
    color: var(--primary-color);

    &:hover {
        border-color: #667eea;
        background: #f8f9ff;
        transform: translateY(-2px);
    }

    &.edit {
        &:hover {
            border-color: #28a745;
            background: #f8fff9;
        }
    }

    &.settings {
        &:hover {
            border-color: #ffc107;
            background: #fffcf0;
        }
    }

    &.export {
        &:hover {
            border-color: #17a2b8;
            background: #f0faff;
        }
    }

    i {
        font-size: 1.1rem;
    }
`;

const ProfileAchievements = styled.div`
    padding: 2rem;
    border-top: 1px solid #e9ecef;
    margin-top: 1rem;
`;

const AchievementTitle = styled.h3`
    color: var(--primary-color);
    margin-bottom: 1rem;
    font-size: 1.2rem;
`;

const AchievementGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
`;

const Achievement = styled.div`
    text-align: center;
    padding: 1rem;
    border-radius: 12px;
    background: #f8f9fa;
    opacity: 0.5;
    transition: all 0.3s ease;

    &.earned {
        opacity: 1;
        background: linear-gradient(135deg, #FFD700, #FFA500);
        color: white;
        transform: scale(1.02);
    }
`;

const AchievementIcon = styled.div`
    font-size: 2rem;
    margin-bottom: 0.5rem;

    .earned & {
        color: white;
    }
`;

const AchievementName = styled.div`
    font-weight: 600;
    margin-bottom: 0.2rem;
    font-size: 0.9rem;
`;

const AchievementDesc = styled.div`
    font-size: 0.8rem;
    opacity: 0.8;
`;

const ProfileFooter = styled.div`
    padding: 2rem;
    border-top: 1px solid #e9ecef;
`;

const FooterButton = styled.button`
    width: 100%;
    padding: 1rem;
    background: #ff4757;
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.3s ease;

    &:hover {
        background: #ff3742;
        transform: translateY(-2px);
    }
`;

export default Navigation