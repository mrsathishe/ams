import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { authAPI } from "@/lib/api/authApi";
import { apiErrorMessage } from "@/lib/api/apiError";
import ChangePasswordModal from "../ChangePasswordModal";
import PasswordInput from "./PasswordInput";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const user = await login(email, password);
      navigate(
        user.is_super_admin
          ? "/admin"
          : user.approval_status === "approved"
            ? "/dashboard"
            : "/pending-approval",
      );
    } catch (err) {
      setError(apiErrorMessage(err, "Invalid email or password"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (resetEmail: string, newPassword: string) => {
    try {
      await authAPI.changePassword(resetEmail, newPassword);
    } catch (err) {
      throw new Error(apiErrorMessage(err, "Failed to change password."));
    }
  };

  return (
    <>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="login-email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-form-input"
            />
          </div>

          <PasswordInput
            id="login-password"
            name="password"
            label="Password"
            value={password}
            onChange={setPassword}
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={isLoading} className="button">
          {isLoading ? "Please wait..." : "Log in"}
        </button>

        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="change-password"
          >
            Forgot or change your password?
          </button>
        </div>
      </form>

      <ChangePasswordModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onSubmit={handleReset}
      />
    </>
  );
}
