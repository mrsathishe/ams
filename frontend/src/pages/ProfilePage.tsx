import React, { useState } from "react";
import { authAPI } from "../lib/api";
import { useAuth } from "../lib/useAuth";
import { AxiosError } from "axios";

const ProfilePage: React.FC = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!user) {
      setError("You must be logged in to update your password.");
      return;
    }

    try {
      const res = await authAPI.updatePassword({
        old_password: oldPassword,
        new_password: newPassword,
      });
      setMessage(res.message);
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "An error occurred.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Update Password</h1>
      {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{message}</div>}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="oldPassword">
            Old Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="oldPassword"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
            New Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;