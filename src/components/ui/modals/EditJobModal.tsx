
'use client';

import { useState } from 'react';
import { JobI } from '@/types/job';
import { User } from '@/types/user';
import { FaUserTie } from 'react-icons/fa';
import { ErrorToast } from '../Toast';
import { searchUser } from '@/lib/job/job-api';
import UserItem from '../UserItem';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    job: JobI;
    onSave: (status: string, users: User[]) => void;
}

const statusOptions = [
    'In_Progress',
    'Pending',
    'Completed',
    'Cancelled',
];

export const EditJobModal = ({ isOpen, onClose, job, onSave }: Props) => {
    const [selectedStatus, setSelectedStatus] = useState(job.job_status || 'Pending');
    const [searchText, setSearchText] = useState<string>('');
    const [searchedUser, setSearchedUser] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);

    if (!isOpen) return null;

    const handleSearch = async () => {
        if (searchText === "") return ErrorToast("Please enter a username");
        setIsSearching(true);

        const response = await searchUser(searchText);
        if (response.success && response.data?.user) {
            setSearchedUser(response.data.user);
        } else {
            ErrorToast(response.error || 'No users found');
        }
        setIsSearching(false);
    };

    const handleSelect = (user: User) => {
        setSelectedUsers(prev =>
            prev.some(u => u.username === user.username)
                ? prev.filter(u => u.username !== user.username)
                : [...prev, user]
        );
    };

    const handleSave = () => {
        onSave(selectedStatus, selectedUsers);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4">
            <div className="bg-white rounded-xl max-w-xl w-full p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold"></h2>
                    <button onClick={onClose} className="text-red-500 text-xl font-bold">X</button>
                </div>

                <div className="space-y-4 pb-8">

                    <div className='w-full flex flex-col gap-y-4 items-center justify-center'>
                        <FaUserTie className="text-6xl text-primary mb-2" />
                        <span className='text-2xl font-bold text-primary'>Got a Freelancer?</span>
                        <label className="block text-xl font-semibold text-gray-700">Select the Status of the Job</label>
                        <select
                            value={selectedStatus}
                            onChange={e => setSelectedStatus(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2"
                        >
                            {statusOptions.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    {selectedStatus !== 'Pending' && selectedStatus !== 'Cancelled' && (
                        <>
                            <div className="flex gap-2 mt-4">
                                <input
                                    type="text"
                                    placeholder="Paste username.."
                                    value={searchText}
                                    onChange={e => setSearchText(e.target.value)}
                                    className="flex-1 border border-gray-300 rounded-md p-2"
                                />
                                <button
                                    onClick={handleSearch}
                                    className="bg-primary text-white px-4 py-2 rounded-md"
                                >
                                    {isSearching ? 'Searching...' : 'Search'}
                                </button>
                            </div>

                            {searchedUser && Array.isArray(searchedUser) && searchedUser.length > 0 &&
                                searchedUser.map((user, idx) => (
                                    <UserItem
                                        key={idx}
                                        profilePic={user.profilePic?.url || '/default-profile.png'}
                                        username={user.username}
                                        selected={selectedUsers.some(u => u.username === user.username)}
                                        onSelect={() => handleSelect(user)}
                                    />
                                ))
                            }
                        </>
                    )}
                </div>

                {/* Show OK button based on status and user selection logic */}
                {selectedStatus === 'Pending' || selectedStatus === 'Cancelled' ? (
                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={handleSave}
                            className="bg-primary text-white px-6 py-2 rounded-md"
                        >
                            OK
                        </button>
                    </div>
                ) : selectedStatus !== 'Pending' && 
                   selectedStatus !== 'Cancelled' && 
                   selectedUsers && 
                   Array.isArray(selectedUsers) && 
                   selectedUsers.length > 0 ? (
                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={handleSave}
                            className="bg-primary text-white px-6 py-2 rounded-md"
                        >
                            OK
                        </button>
                    </div>
                ) : null}
            </div>
        </div>
    );
};
