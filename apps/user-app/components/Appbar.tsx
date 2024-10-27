import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { IoNotifications } from "react-icons/io5";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "@repo/firebase/firebase";

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

interface UserDetails {
  name: string;
  email: string;
  profileImg: string;
  number: string;
  isVerified: boolean;
}

export const Appbar: React.FC<AppbarProps> = ({ user }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] =
    useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [editDetails, setEditDetails] = useState({
    name: "",
    email: "",
    profileImg: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [filePrec, setFilePrec] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);

  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  useEffect(() => {
    if (user?.email) {
      fetchNotifications();
      fetchUserDetails();
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

  const fetchUserDetails = async () => {
    try {
      const res = await fetch("/api/userDetails");
      const data = await res.json();
      setUserDetails(data);
      setEditDetails({
        name: data.name,
        email: data.email,
        profileImg: data.profileImg,
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleProfileClick = () => {
    setIsProfileDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditDetails((prev) => ({ ...prev, [name]: value }));
  };
  const handleSaveChanges = async () => {
    try {
      await fetch("/api/updateUserDetails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editDetails),
      });
      setIsProfileDialogOpen(false);
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  const handleFileUpload = (file: File) => {
    if (!file) return;
    const storage = getStorage(app);
    const fileName = new Date().getTime() + "_" + file.name;
    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePrec(Math.round(progress));
      },
      (error) => {
        console.error("Upload failed:", error);
        setFileUploadError(true);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setEditDetails((prev) => ({ ...prev, profileImg: downloadURL }));
        } catch (error) {
          console.error("Error getting download URL:", error);
        }
      }
    );
  };

  return (
    <div className="flex justify-between items-center border-b px-8 py-3 border-slate-300 bg-white">
      <div className="text-xl font-semibold text-black">MyWallet</div>

      <div className="flex items-center space-x-6">
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

        {user && (
          <div className="flex items-center">
            <div
              className="w-10 h-10 rounded-full overflow-hidden cursor-pointer"
              onClick={handleProfileClick}
            >
              <Image
                src={user.profileImg || ""}
                alt="Profile"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
          </div>
        )}
        {isProfileDialogOpen && userDetails && (
          <div className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 z-50 !p-0 !m-0">
            <div className="bg-white p-6 rounded-lg w-96 shadow-lg relative">
              <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col items-center">
                  <input
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFile(e.target.files[0]);
                      }
                    }}
                    type="file"
                    ref={fileRef}
                    hidden
                    accept="image/*"
                  />
                  <Image
                    onClick={() => fileRef.current?.click()}
                    src={editDetails.profileImg || "/placeholder-image.png"}
                    alt="Profile"
                    className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
                    width={96}
                    height={96}
                  />
                </div>
                <p className="text-sm self-center">
                  {fileUploadError ? (
                    <span className="text-red-700">
                      Error Image upload (image must be less than 2 mb)
                    </span>
                  ) : filePrec > 0 && filePrec < 100 ? (
                    <span className="text-slate-700">{`Uploading ${filePrec}%`}</span>
                  ) : filePrec === 100 ? (
                    <span className="text-green-700">
                      Image successfully uploaded!
                    </span>
                  ) : (
                    ""
                  )}
                </p>
                <div>
                  <label className="block text-sm font-medium">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editDetails.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editDetails.email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={userDetails.number}
                    disabled
                    className="w-full border border-gray-300 p-2 rounded bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Verified Status
                  </label>
                  <input
                    type="text"
                    value={userDetails.isVerified ? "Verified" : "Not Verified"}
                    disabled
                    className="w-full border border-gray-300 p-2 rounded bg-gray-100"
                  />
                </div>
                <button
                  onClick={handleSaveChanges}
                  className="bg-purple-700 text-white py-2 px-4 rounded mt-4"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsProfileDialogOpen(false)}
                  className="bg-red-500 text-white py-2 px-4 rounded mt-4"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
