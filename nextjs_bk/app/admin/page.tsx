"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../lib/auth";
import { expensesAPI, paymentsAPI, documentsAPI } from "../../lib/api";
import { ExpenseWithPayments, User } from "../../types";
import ExpenseCharts from "../../components/ExpenseCharts";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [expenses, setExpenses] = useState<ExpenseWithPayments[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
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
    if (user && user.role === "admin") {
      fetchExpenses();
    }
  }, [user, selectedYear, selectedMonth]);

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      const expensesData = await expensesAPI.getExpenses(
        selectedMonth || undefined,
        selectedYear
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
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">Welcome, {user.name}</p>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Action Buttons */}
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
          <h2 className="text-lg font-semibold mb-4">Expense Management</h2>
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
                      Total Paid
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remaining
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payments
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{expense.total_paid.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{expense.remaining_amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {expense.payments.length} payment(s)
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Charts */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Analytics</h2>
          <ExpenseCharts year={selectedYear} />
        </div>
      </main>

      {/* Add Expense Modal */}
      {showExpenseForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Add New Expense
            </h3>
            <form onSubmit={handleCreateExpense}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newExpense.amount}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, amount: e.target.value })
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Month
                </label>
                <select
                  value={newExpense.month}
                  onChange={(e) =>
                    setNewExpense({
                      ...newExpense,
                      month: Number(e.target.value),
                    })
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                >
                  {months.map((month, index) => (
                    <option key={index} value={index + 1}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Year
                </label>
                <input
                  type="number"
                  required
                  value={newExpense.year}
                  onChange={(e) =>
                    setNewExpense({
                      ...newExpense,
                      year: Number(e.target.value),
                    })
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  value={newExpense.expense_type}
                  onChange={(e) =>
                    setNewExpense({
                      ...newExpense,
                      expense_type: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="EB">Electricity Bill</option>
                  <option value="Water">Water Bill</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={newExpense.description}
                  onChange={(e) =>
                    setNewExpense({
                      ...newExpense,
                      description: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowExpenseForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
                >
                  Create Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
