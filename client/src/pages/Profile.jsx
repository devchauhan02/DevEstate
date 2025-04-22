import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef();
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [profilePic, setProfilePic] = useState(currentUser.user.profilePic);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'DevEstate');

    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://api.cloudinary.com/v1_1/dohk8ugal/image/upload', true);
      setUploading(true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      };

      xhr.onload = () => {
        setUploading(false);
        setUploadProgress(0);
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          setProfilePic(data.secure_url);
          console.log('Upload successful:', data.secure_url);
        } else {
          console.error('Upload failed:', xhr.responseText);
        }
      };

      xhr.onerror = () => {
        setUploading(false);
        console.error('Upload error');
      };

      xhr.send(formData);
    } catch (error) {
      setUploading(false);
      console.error('Upload exception:', error);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 mt-10">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Profile</h1>

        <div className="flex flex-col items-center relative mb-6">
          <input
            type="file"
            className="hidden"
            ref={fileRef}
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <div className="relative">
            <img
              src={profilePic}
              alt="Profile"
              className="h-32 w-32 object-cover rounded-full cursor-pointer"
              onClick={() => fileRef.current.click()}
            />
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full animate-pulse">
                <p className="text-white text-sm font-semibold">
                  Uploading {uploadProgress}%
                </p>
              </div>
            )}
          </div>
          <h2 className="text-xl font-semibold mt-4">{currentUser.name}</h2>
          <p className="text-gray-600 text-sm">{currentUser.email}</p>
        </div>

        <form className="flex flex-col gap-4 rounded-lg">
          <input
            type="text"
            placeholder="username"
            className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-slate-800"
          />
          <input
            type="email"
            placeholder="email"
            className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-slate-800"
          />
          <input
            type="password"
            placeholder="password"
            className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-slate-800"
          />
          <button
            type="submit"
            className="bg-slate-800 text-white px-4 py-2 uppercase hover:opacity-90 transition rounded-lg cursor-pointer"
          >
            Update
          </button>
        </form>

        <div className="flex justify-between mt-6 text-sm">
          <span className="text-red-500 font-medium cursor-pointer">Delete Account</span>
          <span className="text-red-500 font-medium cursor-pointer">Sign Out</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
