"use client";

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processAuthCallback = async () => {
      try {
        const authStatus = searchParams.get("auth_status");
        const authMethod = searchParams.get("auth_method");
        const timestamp = searchParams.get("timestamp");
        const token = searchParams.get("token");
        const tokenType = searchParams.get("token_type");
        const expiresIn = searchParams.get("expires_in");
        const errorCode = searchParams.get("error_code");
        const errorMessage = searchParams.get("error_message");

        if (authStatus === "success") {
          if (!token) {
            setError("Authentication successful but no token received");
            setTimeout(() => navigate("/"), 3000);
            return;
          }

          let userInfo;
          try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            userInfo = {
              id: payload.user_id || payload.sub || payload.id,
              username:
                payload.username || payload.email || payload.preferred_username,
              role: payload.role || "user",
              exp: payload.exp,
            };
          } catch (jwtError) {
            console.error("Error decoding JWT:", jwtError);
            setError("Invalid token format received");
            setTimeout(() => navigate("/"), 3000);
            return;
          }

          try {
            const response = await fetch(
              "http://localhost:8001/auth/exchange-token",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `token=${token}`,
              },
            );

            if (response.ok) {
              const exchangeData = await response.json();
              const amsToken = exchangeData.access_token;
              const userDetails = exchangeData.user;

              const currentTime = Math.floor(Date.now() / 1000);
              const tokenExpiresAt = expiresIn
                ? currentTime + parseInt(expiresIn)
                : userInfo.exp;

              const authData = {
                id: userDetails.id || userInfo.id,
                username:
                  userDetails.name || userDetails.email || userInfo.username,
                email: userDetails.email,
                fullName: userDetails.full_name || userDetails.name,
                role: userDetails.role || userInfo.role || "user",
                authMethod,
                timestamp,
                token: amsToken,
                tokenType: "bearer",
                expiresAt: tokenExpiresAt,
                isAuthenticated: true,
                userDetails,
              };

              localStorage.setItem("auth_user", JSON.stringify(authData));

              setTimeout(() => {
                if ((userDetails.role || userInfo.role) === "admin") {
                  navigate("/admin");
                } else {
                  navigate("/dashboard");
                }
              }, 2000);
            } else {
              const errorData = await response.json();
              console.error(
                "Token exchange failed:",
                response.status,
                errorData,
              );

              const currentTime = Math.floor(Date.now() / 1000);
              const tokenExpiresAt = expiresIn
                ? currentTime + parseInt(expiresIn)
                : userInfo.exp;

              const authData = {
                id: userInfo.id,
                username: userInfo.username,
                role: userInfo.role || "user",
                authMethod,
                timestamp,
                token,
                tokenType: tokenType || "bearer",
                expiresAt: tokenExpiresAt,
                isAuthenticated: true,
              };

              localStorage.setItem("auth_user", JSON.stringify(authData));

              setTimeout(() => {
                if (userInfo.role === "admin") {
                  navigate("/admin");
                } else {
                  navigate("/dashboard");
                }
              }, 2000);
            }
          } catch (apiError) {
            console.error("Error during token exchange:", apiError);

            const currentTime = Math.floor(Date.now() / 1000);
            const tokenExpiresAt = expiresIn
              ? currentTime + parseInt(expiresIn)
              : userInfo.exp;

            const authData = {
              id: userInfo.id,
              username: userInfo.username,
              role: userInfo.role || "user",
              authMethod,
              timestamp,
              token,
              tokenType: tokenType || "bearer",
              expiresAt: tokenExpiresAt,
              isAuthenticated: true,
            };

            localStorage.setItem("auth_user", JSON.stringify(authData));

            setTimeout(() => {
              if (userInfo.role === "admin") {
                navigate("/admin");
              } else {
                navigate("/dashboard");
              }
            }, 2000);
          }
        } else if (authStatus === "error") {
          console.error("Authentication failed:", {
            authMethod,
            timestamp,
            errorCode,
            errorMessage,
          });

          const errorMsg =
            errorMessage ||
            `Authentication failed with code: ${errorCode}` ||
            "Authentication failed";
          setError(errorMsg);
          setTimeout(() => navigate("/"), 5000);
        } else {
          console.warn("Unexpected authentication callback:", {
            authStatus,
            authMethod,
            timestamp,
          });

          setError("Invalid authentication callback");
          setTimeout(() => navigate("/"), 3000);
        }
      } catch (err) {
        console.error("Error processing authentication callback:", err);
        setError("Failed to process authentication response");
        setTimeout(() => navigate("/"), 3000);
      } finally {
        setIsProcessing(false);
      }
    };

    processAuthCallback();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full rounded-lg bg-white p-6 shadow text-center">
        {error ? (
          <>
            <h2 className="text-xl font-semibold text-red-600">
              Authentication Error
            </h2>
            <p className="mt-3 text-gray-700">{error}</p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-900">
              Processing Authentication
            </h2>
            <p className="mt-3 text-gray-600">
              {isProcessing
                ? "Please wait while we complete your login..."
                : "Redirecting..."}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
