"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processAuthCallback = async () => {
      try {
        // Get parameters from URL
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
            setTimeout(() => {
              router.push("/");
            }, 3000);
            return;
          }

          // Decode JWT token to get user information
          let userInfo;
          try {
            // Parse JWT payload (this is a simple decode, in production you should verify the token)
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
            setTimeout(() => {
              router.push("/");
            }, 3000);
            return;
          }

          // Handle successful authentication
          console.log("Authentication successful:", {
            authMethod,
            timestamp,
            token: token.substring(0, 20) + "...", // Log partial token for security
            tokenType,
            expiresIn,
            userInfo,
          });

          // Exchange external token for AMS token
          try {
            const response = await fetch(
              "http://localhost:8001/auth/exchange-token",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `token=${token}`,
              }
            );

            if (response.ok) {
              const exchangeData = await response.json();
              console.log("Token exchange successful:", exchangeData);

              // Use the new AMS token and user details
              const amsToken = exchangeData.access_token;
              const userDetails = exchangeData.user;

              // Calculate token expiration time
              const currentTime = Math.floor(Date.now() / 1000);
              const tokenExpiresAt = expiresIn
                ? currentTime + parseInt(expiresIn)
                : userInfo.exp;

              // Store comprehensive auth data in localStorage
              const authData = {
                id: userDetails.id || userInfo.id,
                username:
                  userDetails.name || userDetails.email || userInfo.username,
                email: userDetails.email,
                fullName: userDetails.full_name || userDetails.name,
                role: userDetails.role || userInfo.role || "user",
                authMethod: authMethod,
                timestamp: timestamp,
                token: amsToken, // Use the AMS token instead of external token
                tokenType: "bearer",
                expiresAt: tokenExpiresAt,
                isAuthenticated: true,
                userDetails: userDetails,
              };

              localStorage.setItem("auth_user", JSON.stringify(authData));

              // Redirect to dashboard based on user role
              setTimeout(() => {
                if ((userDetails.role || userInfo.role) === "admin") {
                  router.push("/admin");
                } else {
                  router.push("/dashboard");
                }
              }, 2000);
            } else {
              const errorData = await response.json();
              console.error(
                "Token exchange failed:",
                response.status,
                errorData
              );

              // Fall back to basic user info from external token
              const currentTime = Math.floor(Date.now() / 1000);
              const tokenExpiresAt = expiresIn
                ? currentTime + parseInt(expiresIn)
                : userInfo.exp;

              const authData = {
                id: userInfo.id,
                username: userInfo.username,
                role: userInfo.role || "user",
                authMethod: authMethod,
                timestamp: timestamp,
                token: token, // Keep external token as fallback
                tokenType: tokenType || "bearer",
                expiresAt: tokenExpiresAt,
                isAuthenticated: true,
              };

              localStorage.setItem("auth_user", JSON.stringify(authData));

              setTimeout(() => {
                if (userInfo.role === "admin") {
                  router.push("/admin");
                } else {
                  router.push("/dashboard");
                }
              }, 2000);
            }
          } catch (apiError) {
            console.error("Error during token exchange:", apiError);

            // Fall back to basic user info from external token
            const currentTime = Math.floor(Date.now() / 1000);
            const tokenExpiresAt = expiresIn
              ? currentTime + parseInt(expiresIn)
              : userInfo.exp;

            const authData = {
              id: userInfo.id,
              username: userInfo.username,
              role: userInfo.role || "user",
              authMethod: authMethod,
              timestamp: timestamp,
              token: token,
              tokenType: tokenType || "bearer",
              expiresAt: tokenExpiresAt,
              isAuthenticated: true,
            };

            localStorage.setItem("auth_user", JSON.stringify(authData));

            setTimeout(() => {
              if (userInfo.role === "admin") {
                router.push("/admin");
              } else {
                router.push("/dashboard");
              }
            }, 2000);
          }
        } else if (authStatus === "error") {
          // Handle authentication error
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

          setTimeout(() => {
            router.push("/");
          }, 5000);
        } else {
          // Handle unexpected auth status or missing parameters
          console.warn("Unexpected authentication callback:", {
            authStatus,
            authMethod,
            timestamp,
          });

          setError("Invalid authentication callback");
          setTimeout(() => {
            router.push("/");
          }, 3000);
        }
      } catch (err) {
        console.error("Error processing authentication callback:", err);
        setError("Failed to process authentication response");
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } finally {
        setIsProcessing(false);
      }
    };

    processAuthCallback();
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-red-600">
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Authentication Error
            </h2>
            <p className="mt-2 text-sm text-gray-600">{error}</p>
            <p className="mt-2 text-xs text-gray-500">
              You will be redirected to the home page shortly.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-indigo-600">
              <svg
                className="animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Processing Authentication
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please wait while we process your authentication...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-green-600">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Authentication Successful
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Redirecting to your dashboard...
          </p>
        </div>
      </div>
    </div>
  );
}
