import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import {updateUserStart, updateUserFailure, updateUserSuccess} from '../redux/user/userSlice.js';
import { useDispatch } from 'react-redux';

const Profile = () => {
  const { currentUser , token } = useSelector((state) => state.user);
  const fileRef = useRef();
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [profilePic, setProfilePic] = useState(currentUser.profilePic);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    password: '',
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', import.meta.env.VITE_CLOUDINARY_API_URL, true);
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
          setFormData((prev) => ({ ...prev, profilePic: data.secure_url }));
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

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => { 
    e.preventDefault();
    const { name, email, password } = formData;
    const updatedData = {
      name,
      email,  
      password,
      profilePic,
    };  

    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      const data = await res.json();
      if (res.ok) {
        dispatch(updateUserSuccess(data.user));
      } else {
        dispatch(updateUserFailure(data.message || 'Failed to update profile'));

      }
    }
    catch (error) {
      dispatch(updateUserFailure(error.message));
    } 
  }

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
              className="h-25 w-25 object-cover rounded-full cursor-pointer"
              onClick={() => fileRef.current.click()}
            />
            {uploading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 rounded-full">
                <p className="text-white text-sm font-semibold">Uploading</p>
                <p className="text-white text-sm font-medium">{uploadProgress}%</p>
              </div>
            )}
          </div>
          <h2 className="text-xl font-semibold mt-4">{currentUser.name}</h2>
          {/* <p className="text-gray-600 text-sm">{currentUser.email}</p> */}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg">
          <input
            type="text"
            id="name"
            placeholder="username"
            value={formData.name}
            onChange={handleChange}
            className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-slate-100"
          />
          <input
            type="email"
            id="email"
            placeholder="email"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-slate-100"
          />
          <input
            type="password"
            id="password"
            placeholder="password"
            value={formData.password}
            onChange={handleChange}
            className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-slate-100"
          />
          <button
            type="submit"
            className="bg-slate-800 text-white px-4 py-2 uppercase hover:opacity-35 transition rounded-lg cursor-pointer"
          >
            Update
          </button>
        </form>

        <div className="flex justify-between mt-6 text-sm">
          <span className="text-red-500 font-medium cursor-pointer">Delete account</span>
          <span className="text-red-500 font-medium cursor-pointer">Sign Out</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
