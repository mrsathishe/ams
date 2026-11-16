"use client";

import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { authAPI } from "@/lib/api/authApi";
import { communitiesAPI } from "@/lib/api/communitesApi";
import { apiErrorMessage } from "@/lib/api/apiError";
import { Building, Community, RegisterData } from "@/types";
import ChangePasswordModal from "../components/ChangePasswordModal";
import SearchableDropdown from "../components/SearchableDropdown";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [communityId, setCommunityId] = useState("");
  const [buildingId, setBuildingId] = useState("");
  const [flatNumber, setFlatNumber] = useState("");
  const [relationship, setRelationship] = useState<"Owner" | "Rental">("Owner");
  const [communityLoadError, setCommunityLoadError] = useState("");
  const [buildingLoadError, setBuildingLoadError] = useState("");
  const [isLoadingCommunities, setIsLoadingCommunities] = useState(true);
  const [isLoadingBuildings, setIsLoadingBuildings] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    communitiesAPI
      .getCommunities()
      .then(setCommunities)
      .catch((requestError: unknown) =>
        setCommunityLoadError(
          apiErrorMessage(requestError, "Could not load communities."),
        ),
      )
      .finally(() => setIsLoadingCommunities(false));
  }, []);

  useEffect(() => {
    let active = true;
    if (!communityId) {
      setBuildings([]);
      setBuildingId("");
      setBuildingLoadError("");
      setIsLoadingBuildings(false);
      return;
    }
    setBuildings([]);
    setBuildingId("");
    setBuildingLoadError("");
    setIsLoadingBuildings(true);
    communitiesAPI
      .getBuildings(communityId)
      .then((items) => {
        if (active) {
          setBuildings(items);
          setBuildingId("");
        }
      })
      .catch((requestError: unknown) => {
        if (active) {
          setBuildings([]);
          setBuildingLoadError(
            apiErrorMessage(requestError, "Could not load buildings."),
          );
        }
      })
      .finally(() => {
        if (active) setIsLoadingBuildings(false);
      });
    return () => {
      active = false;
    };
  }, [communityId]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (isRegistering && (!communityId || !buildingId || !flatNumber.trim())) {
      setError(
        "Select a community and building, then enter your flat or unit number.",
      );
      return;
    }

    if (isRegistering && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const registrationData: RegisterData = {
        email,
        name,
        phone_number: phoneNumber,
        password,
        relationship,
        community_id: communityId,
        building_id: buildingId,
        flat_number: flatNumber.trim(),
      };

      const currentUser = isRegistering
        ? await register(registrationData)
        : await login(email, password);
      navigate(
        currentUser.is_super_admin
          ? "/admin"
          : currentUser.approval_status === "approved"
            ? "/dashboard"
            : "/pending-approval",
      );
    } catch (err: unknown) {
      setError(
        apiErrorMessage(
          err,
          isRegistering ? "Registration failed" : "Invalid email or password",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (email: string, newPassword: string) => {
    try {
      await authAPI.changePassword(email, newPassword);
    } catch (err: unknown) {
      throw new Error(
        apiErrorMessage(
          err,
          "Failed to change password. Please check your email and try again.",
        ),
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Kootukudil
          </p>
          <h2 className="mt-3 text-center text-3xl font-extrabold text-gray-900">
            {isRegistering ? "Create your account" : "Welcome back"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Apartment electricity and community management
          </p>
        </div>
        <div
          className="grid grid-cols-2 rounded-md border border-gray-200 bg-white p-1"
          role="tablist"
          aria-label="Account access"
        >
          <button
            type="button"
            role="tab"
            aria-selected={!isRegistering}
            onClick={() => {
              setIsRegistering(false);
              setError("");
            }}
            className={`rounded px-3 py-2 text-sm font-medium ${!isRegistering ? "bg-emerald-700 text-white" : "text-gray-600 hover:bg-gray-50"}`}
          >
            Log in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={isRegistering}
            onClick={() => {
              setIsRegistering(true);
              setError("");
            }}
            className={`rounded px-3 py-2 text-sm font-medium ${isRegistering ? "bg-emerald-700 text-white" : "text-gray-600 hover:bg-gray-50"}`}
          >
            Register
          </button>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {isRegistering && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={100}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>
            )}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {isRegistering && (
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone number
                </label>
                <input
                  id="phoneNumber"
                  name="phone_number"
                  type="tel"
                  autoComplete="tel"
                  required
                  minLength={7}
                  maxLength={20}
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>
            )}
            {isRegistering && (
              <>
                <fieldset>
                  <legend className="block text-sm font-medium text-gray-700">
                    Relationship to this flat
                  </legend>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {(["Owner", "Rental"] as const).map((value) => (
                      <button
                        key={value}
                        type="button"
                        aria-pressed={relationship === value}
                        onClick={() => setRelationship(value)}
                        className={`rounded border px-3 py-2 text-sm font-medium ${relationship === value ? "border-emerald-700 bg-emerald-50 text-emerald-900" : "border-gray-300 text-gray-600 hover:bg-gray-50"}`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <SearchableDropdown
                  id="community"
                  label="Community / Apartment"
                  options={communities.map((community) => ({
                    id: community.id,
                    label: community.name,
                  }))}
                  value={communityId}
                  onChange={(id) => {
                    setCommunityId(id);
                    setBuildingId("");
                    setFlatNumber("");
                  }}
                  placeholder="Search communities"
                />
                {communityLoadError && (
                  <p role="alert" className="text-sm text-red-700">
                    {communityLoadError}
                  </p>
                )}
                {isLoadingCommunities && (
                  <p className="text-sm text-gray-500">
                    Loading communities...
                  </p>
                )}
                {!isLoadingCommunities &&
                  !communityLoadError &&
                  communities.length === 0 && (
                    <p className="text-sm text-gray-500">
                      No communities are configured yet. Contact a Super Admin.
                    </p>
                  )}
                <SearchableDropdown
                  key={`building-${communityId}`}
                  id="building"
                  label="Building / Block"
                  options={buildings.map((building) => ({
                    id: building.id,
                    label: building.name,
                  }))}
                  value={buildingId}
                  onChange={(id) => {
                    setBuildingId(id);
                    setFlatNumber("");
                  }}
                  placeholder={
                    communityId
                      ? "Search buildings"
                      : "Select a community first"
                  }
                  disabled={!communityId}
                />
                {buildingLoadError && (
                  <p role="alert" className="text-sm text-red-700">
                    {buildingLoadError}
                  </p>
                )}
                {isLoadingBuildings && (
                  <p className="text-sm text-gray-500">Loading buildings...</p>
                )}
                {communityId &&
                  !isLoadingBuildings &&
                  buildings.length === 0 &&
                  !buildingLoadError && (
                    <p className="text-sm text-gray-500">
                      No buildings are configured for this community yet.
                    </p>
                  )}
                <div>
                  <label
                    htmlFor="flatNumber"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Flat / Unit name or number
                  </label>
                  <input
                    id="flatNumber"
                    name="flat_number"
                    required
                    maxLength={80}
                    value={flatNumber}
                    onChange={(event) => setFlatNumber(event.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </>
            )}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                {!isRegistering && (
                  <button
                    type="button"
                    onClick={() => setShowChangePasswordModal(true)}
                    className="text-sm text-emerald-600 transition-colors hover:text-emerald-700 hover:underline focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 rounded px-1"
                  >
                    Change password?
                  </button>
                )}
              </div>
              <div className="mt-1 flex rounded-md border border-gray-300 focus-within:border-emerald-700 focus-within:ring-1 focus-within:ring-emerald-700">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={
                    isRegistering ? "new-password" : "current-password"
                  }
                  required
                  minLength={8}
                  className="min-w-0 flex-1 rounded-md border-0 px-3 py-2 text-gray-900 focus:outline-none focus:ring-0"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="px-3 text-sm text-gray-600 hover:text-gray-900"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            {isRegistering && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>
            )}
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? "Please wait..."
                : isRegistering
                  ? "Create account"
                  : "Log in"}
            </button>
          </div>
        </form>
      </div>
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        onSubmit={handleChangePassword}
      />
    </div>
  );
}
