"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthManager } from "../../lib/auth-manager";
import { expensesAPI, paymentsAPI, documentsAPI } from "../../lib/api";
import { ExpenseWithPayments, Payment } from "../../types";
import ExpenseCharts from "../../components/ExpenseCharts";

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(AuthManager.getAuthUser());
  const [expenses, setExpenses] = useState<ExpenseWithPayments[]>([]);
  const [userPayments, setUserPayments] = useState<Payment[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication on component mount
    const authUser = AuthManager.getAuthUser();
    if (!authUser || !AuthManager.isAuthenticated()) {
      router.push("/");
      return;
    }
    setUser(authUser);
    fetchData();
  }, [router]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, selectedYear, selectedMonth]);

  const handleLogout = () => {
    AuthManager.logout();
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [expensesData, paymentsData] = await Promise.all([
        expensesAPI.getExpenses(selectedMonth || undefined, selectedYear),
        paymentsAPI.getUserPayments(user!.id),
      ]);
      setExpenses(expensesData);
      setUserPayments(paymentsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPaymentStatus = (expenseId: string) => {
    const payment = userPayments.find((p) => p.expense_id === expenseId);
    return payment ? { paid: true, payment } : { paid: false, payment: null };
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                AMS Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome, {user?.fullName || user?.username || "User"}
                {user?.email && (
                  <span className="text-sm text-gray-500"> ({user.email})</span>
                )}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* User Profile Section */}
        {user?.userDetails && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {user.fullName || "Not provided"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {user.email || "Not provided"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {user.role || "user"}
                  </span>
                </p>
              </div>
            </div>
            {user.userDetails && Object.keys(user.userDetails).length > 0 && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Additional Details
                </label>
                <div className="mt-2 bg-gray-50 rounded-md p-3">
                  <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                    {JSON.stringify(user.userDetails, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              >
                {Array.from(
                  { length: 5 },
                  (_, i) => new Date().getFullYear() - i
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Month
              </label>
              <select
                value={selectedMonth || ""}
                onChange={(e) =>
                  setSelectedMonth(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Months</option>
                {months.map((month, index) => (
                  <option key={index} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Expenses List */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Apartment Expenses</h2>
          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : expenses.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No expenses found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Month/Year
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {expenses.map((expense) => {
                    const { paid, payment } = getPaymentStatus(expense.id);
                    return (
                      <tr key={expense.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {months[expense.month - 1]} {expense.year}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {expense.expense_type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{expense.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              paid
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {paid ? "Paid" : "Unpaid"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment
                            ? new Date(
                                payment.payment_date
                              ).toLocaleDateString()
                            : "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Charts */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Expense Analytics</h2>
          <ExpenseCharts year={selectedYear} />
        </div>
      </main>
    </div>
  );
}
