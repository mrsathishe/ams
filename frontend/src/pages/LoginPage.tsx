"use client";

import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { apartmentsAPI } from "../../lib/api";
import { apiErrorMessage } from "../../lib/api-error";
import { ApartmentRegistrationOption, RegisterData } from "../../types";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apartments, setApartments] = useState<ApartmentRegistrationOption[]>(
    [],
  );
  const [apartmentChoice, setApartmentChoice] = useState("new");
  const [flatChoice, setFlatChoice] = useState("new");
  const [apartmentName, setApartmentName] = useState("");
  const [totalFlatCount, setTotalFlatCount] = useState("");
  const [flatName, setFlatName] = useState("");
  const [relationship, setRelationship] = useState<"Owner" | "Tenant">("Owner");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    apartmentsAPI
      .getRegistrationOptions()
      .then(setApartments)
      .catch(() => setApartments([]));
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (isRegistering && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const registrationData: RegisterData = {
        email,
        name,
        password,
        relationship,
      };
      if (apartmentChoice === "new") {
        registrationData.apartment_name = apartmentName.trim() || undefined;
        registrationData.total_flat_count = Number(totalFlatCount);
        registrationData.flat_name = flatName.trim();
      } else {
        registrationData.apartment_id = apartmentChoice;
        if (flatChoice === "new") {
          registrationData.flat_name = flatName.trim();
        } else {
          registrationData.flat_id = flatChoice;
        }
      }

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
              <>
                <div>
                  <label
                    htmlFor="apartment"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Apartment
                  </label>
                  <select
                    id="apartment"
                    value={apartmentChoice}
                    onChange={(event) => {
                      setApartmentChoice(event.target.value);
                      setFlatChoice("new");
                    }}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  >
                    <option value="new">Add a new apartment</option>
                    {apartments.map((apartment) => (
                      <option key={apartment.id} value={apartment.id}>
                        {apartment.name}
                      </option>
                    ))}
                  </select>
                </div>
                {apartmentChoice === "new" ? (
                  <>
                    <div>
                      <label
                        htmlFor="apartmentName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Apartment name (optional)
                      </label>
                      <input
                        id="apartmentName"
                        value={apartmentName}
                        onChange={(event) =>
                          setApartmentName(event.target.value)
                        }
                        maxLength={120}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="flatCount"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Total flats
                      </label>
                      <input
                        id="flatCount"
                        type="number"
                        min="1"
                        max="500"
                        required
                        value={totalFlatCount}
                        onChange={(event) =>
                          setTotalFlatCount(event.target.value)
                        }
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <label
                      htmlFor="flat"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Flat
                    </label>
                    <select
                      id="flat"
                      value={flatChoice}
                      onChange={(event) => setFlatChoice(event.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    >
                      <option value="new">Add a flat</option>
                      {apartments
                        .find((apartment) => apartment.id === apartmentChoice)
                        ?.flats.map((flat) => (
                          <option key={flat.id} value={flat.id}>
                            {flat.name}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
                {(apartmentChoice === "new" || flatChoice === "new") && (
                  <div>
                    <label
                      htmlFor="flatName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Flat name or number
                    </label>
                    <input
                      id="flatName"
                      required
                      value={flatName}
                      onChange={(event) => setFlatName(event.target.value)}
                      maxLength={80}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    />
                  </div>
                )}
                <fieldset>
                  <legend className="block text-sm font-medium text-gray-700">
                    Relationship to this flat
                  </legend>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {(["Owner", "Tenant"] as const).map((value) => (
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
              </>
            )}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
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
    </div>
  );
}
