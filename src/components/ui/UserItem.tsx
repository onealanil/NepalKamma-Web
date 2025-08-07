'use client';

import React from 'react';
import Image from 'next/image';
import { FaCheckCircle, FaRegCheckCircle } from 'react-icons/fa';

type UserItemProps = {
  profilePic: string;
  username: string;
  selected: boolean;
  onSelect: () => void;
};

const UserItem: React.FC<UserItemProps> = ({ profilePic, username, selected, onSelect }) => {
  return (
    <div style={styles.container}>
      <div style={styles.userInfo}>
        <Image
          src={profilePic}
          alt={`${username}'s profile picture`}
          width={40}
          height={40}
          style={styles.profilePic as React.CSSProperties}
        />
        <span style={styles.username}>{username}</span>
      </div>
      <div onClick={onSelect} style={styles.selectButton}>
        {selected ? (
          <FaCheckCircle size={24} color="#007AFF" />
        ) : (
          <FaRegCheckCircle size={24} color="#8D8D8D" />
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #D9D9D9',
    justifyContent: 'space-between',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },
  profilePic: {
    borderRadius: '50%',
    marginRight: '12px',
  },
  username: {
    fontSize: '16px',
    color: '#333333',
  },
  selectButton: {
    cursor: 'pointer',
    marginLeft: '12px',
  },
};

export default UserItem;
