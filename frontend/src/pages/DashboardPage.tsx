import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/useAuth";
import { expensesAPI, paymentsAPI } from "../lib/api";
import type { ExpenseWithPayments, Payment } from "../types";
import ExpenseCharts from "../components/ExpenseCharts";

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const [expenses, setExpenses] = useState<ExpenseWithPayments[]>([]);
  const [userPayments, setUserPayments] = useState<Payment[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, selectedYear, selectedMonth]);

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
              <p className="text-gray-600">Welcome, {user.name}</p>
            </div>
            <div>
              <Link
                to="/profile"
                className="text-sm font-medium text-gray-500 hover:text-gray-700 mr-4"
              >
                Profile
              </Link>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
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