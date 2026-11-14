"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthManager } from "../../lib/auth-manager";
import { expensesAPI, paymentsAPI, documentsAPI } from "../../lib/api";
import { ExpenseWithPayments, User } from "../../types";
import ExpenseCharts from "../../components/ExpenseCharts";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(AuthManager.getAuthUser());
  const [expenses, setExpenses] = useState<ExpenseWithPayments[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);

  const [newExpense, setNewExpense] = useState({
    amount: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    expense_type: "EB",
    description: "",
  });

  useEffect(() => {
    const authUser = AuthManager.getAuthUser();
    if (!authUser || !AuthManager.isAuthenticated()) {
      navigate("/");
      return;
    }

    const userRole = AuthManager.getUserRole();
    if (userRole !== "admin") {
      navigate("/dashboard");
      return;
    }

    setUser(authUser);
    fetchExpenses();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchExpenses();
    }
  }, [user, selectedYear, selectedMonth]);

  const handleLogout = () => {
    AuthManager.logout();
  };

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      const expensesData = await expensesAPI.getExpenses(
        selectedMonth || undefined,
        selectedYear,
      );
      setExpenses(expensesData);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await expensesAPI.createExpense({
        ...newExpense,
        amount: parseFloat(newExpense.amount),
      });
      setNewExpense({
        amount: "",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        expense_type: "EB",
        description: "",
      });
      setShowExpenseForm(false);
      fetchExpenses();
    } catch (error) {
      console.error("Error creating expense:", error);
    }
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

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600">You don't have admin privileges.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome, {user?.fullName || user?.username || "Admin"}
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
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setShowExpenseForm(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
            >
              Add New Expense
            </button>
            <button
              onClick={() => setShowPaymentForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            >
              Record Payment
            </button>
            <button
              onClick={() => setShowUploadForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Upload Document
            </button>
          </div>
        </div>

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
                  (_, i) => new Date().getFullYear() - i,
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
                    e.target.value ? Number(e.target.value) : null,
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
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {expenses.map((expense) => (
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
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {expense.description || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showExpenseForm && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Add Expense</h3>
            <form
              onSubmit={handleCreateExpense}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input
                type="number"
                placeholder="Amount"
                value={newExpense.amount}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, amount: e.target.value })
                }
                className="border border-gray-300 rounded-md p-2"
                required
              />
              <select
                value={newExpense.month}
                onChange={(e) =>
                  setNewExpense({
                    ...newExpense,
                    month: Number(e.target.value),
                  })
                }
                className="border border-gray-300 rounded-md p-2"
              >
                {months.map((month, index) => (
                  <option key={index} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={newExpense.year}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, year: Number(e.target.value) })
                }
                className="border border-gray-300 rounded-md p-2"
                required
              />
              <input
                type="text"
                placeholder="Expense Type"
                value={newExpense.expense_type}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, expense_type: e.target.value })
                }
                className="border border-gray-300 rounded-md p-2"
              />
              <input
                type="text"
                placeholder="Description"
                value={newExpense.description}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, description: e.target.value })
                }
                className="border border-gray-300 rounded-md p-2 md:col-span-2"
              />
              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowExpenseForm(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <ExpenseCharts year={selectedYear} />
        </div>
      </main>
    </div>
  );
}
