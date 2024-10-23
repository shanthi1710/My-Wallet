import Image from "next/image";
import { IoNotifications } from "react-icons/io5";
import React, { useEffect, useState } from "react";

interface Notification {
  id: number;
  message: string;
  type: string;
  createdAt: string;
  isRead: boolean;
}

interface AppbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    profileImg?: string | null;
  };
  onSignin: () => void;
  onSignout: () => void;
}

export const Appbar: React.FC<AppbarProps> = ({ user }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    if (user?.email) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      setNotifications(data.notifications);
      const unread = data.notifications.filter(
        (notif: Notification) => !notif.isRead
      ).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);

    if (!isDialogOpen) {
      markAllAsRead();
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications/markAsRead", { method: "POST" });
      setUnreadCount(0);
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  return (
    <div className="flex justify-between items-center border-b px-8 py-3 border-slate-300 bg-white">
      <div className="text-xl font-semibold text-black">MyWallet</div>

      <div className="flex items-center space-x-6 cursor-pointer">
        <div className="relative">
          <IoNotifications
            className="text-2xl text-black cursor-pointer"
            onClick={toggleDialog}
          />

          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center w-3 h-3 text-xs font-bold text-white bg-red-500 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

        {isDialogOpen && (
          <div className="absolute top-14 right-10 w-80 bg-white shadow-lg border border-gray-200 rounded-lg z-50">
            <div className="p-4">
              <h3 className="text-lg font-semibold">Notifications</h3>
              <div className="mt-2">
                {notifications.length === 0 ? (
                  <p className="text-sm text-gray-500">No notifications.</p>
                ) : (
                  notifications.slice(0, 5).map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-2 border-b last:border-none ${
                        notif.isRead ? "bg-gray-100" : "bg-white"
                      }`}
                    >
                      <p>{notif.message}</p>
                      <small className="text-xs text-gray-500">
                        {new Date(notif.createdAt).toLocaleString()}
                      </small>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {user ? (
          <div className="flex items-center">
            <Image
              src={user.profileImg || ""}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full cursor-pointer"
            />
          </div>
        ) : (
          <button
            className="text-blue-500"
            onClick={() => {
              console.log("Sign in clicked");
              // Trigger the sign-in function
            }}
          >
            Sign in
          </button>
        )}
      </div>
    </div>
  );
};
