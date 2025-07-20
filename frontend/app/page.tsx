"use client";

export default function HomePage() {
  const handleNavigation = (path: string) => {
    window.location.href = `http://localhost:3000/${path}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">AMS</h1>
          <p className="mt-2 text-gray-600">Apartment Management System</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleNavigation("signin")}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition duration-200"
          >
            Sign In
          </button>

          <button
            onClick={() => handleNavigation("register")}
            className="w-full flex justify-center py-3 px-4 border border-gray-300 text-lg font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition duration-200"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
