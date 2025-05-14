import { useEffect, useState, useCallback } from 'react';
import { FaBell } from 'react-icons/fa';
import { useWebSocket } from '../context/WebSocketContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/axiosConfig';

const NotificationMenu = () => {
    const { currentUser, isAuthenticated } = useAuth();
    const { subscribe } = useWebSocket();
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Load notifications from backend on mount
    const fetchNotifications = useCallback(async () => {
        if (!currentUser) return;
        try {
            const res = await api.get(`/bids/notifications/${currentUser.id}`);
            setNotifications(res.data || []);
            setUnreadCount((res.data || []).filter(n => !n.read).length);
        } catch (err) {
            // ignore errors
        }
    }, [currentUser]);

    useEffect(() => {
        if (isAuthenticated && currentUser) {
            fetchNotifications();
            // Subscribe to real-time notifications
            const sub = subscribe('/user/queue/notifications', (msg) => {
                const notif = JSON.parse(msg.body);
                setNotifications(prev => [notif, ...prev]);
                setUnreadCount(prev => prev + 1);
            });
            return () => {
                if (sub) sub.unsubscribe();
            };
        }
    }, [isAuthenticated, currentUser, subscribe, fetchNotifications]);

    // Mark all as read when menu opens
    const handleOpen = () => {
        setOpen(!open);
        if (!open && unreadCount > 0) {
            setUnreadCount(0);
            // Optionally send "mark as read" to backend here
        }
    };

    return (
        <div className="relative">
            <button
                className="relative flex items-center focus:outline-none"
                onClick={handleOpen}
                aria-label="Notifications"
            >
                <FaBell className="text-xl" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full px-1 text-xs">
                        {unreadCount}
                    </span>
                )}
            </button>
            {open && (
                <div className="absolute right-0 mt-2 w-80 max-h-96 bg-white rounded-md shadow-lg overflow-auto z-30">
                    <div className="p-2 border-b font-bold text-gray-700">Notifications</div>
                    {notifications.length === 0 ? (
                        <div className="p-4 text-gray-500 text-center">No notifications</div>
                    ) : (
                        <ul>
                            {notifications.map((notif, idx) => (
                                <li
                                    key={notif.id || idx}
                                    className={`px-4 py-2 border-b last:border-b-0 hover:bg-gray-100 ${notif.read ? 'text-gray-500' : 'font-semibold'
                                        }`}
                                >
                                    <span>{notif.message}</span>
                                    <div className="text-xs text-gray-400">{new Date(notif.timestamp).toLocaleString()}</div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationMenu;
