import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { analyticsAPI } from "../lib/api";
import {
  ChartsContainer,
  ChartCard,
  ChartTitle,
  LoadingContainer
} from "./ExpenseCharts/styles";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface ExpenseChartsProps {
  year?: number;
}

interface AnalyticsData {
  year: number;
  monthly_data: {
    [key: number]: {
      total_expense: number;
      total_paid: number;
    };
  };
}

export default function ExpenseCharts({ year }: ExpenseChartsProps) {
  const [chartData, setChartData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [year]);

  const fetchAnalytics = async () => {
    try {
      const data = await analyticsAPI.getExpenseAnalytics(year);
      setChartData(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingContainer>Loading charts...</LoadingContainer>;
  }

  if (!chartData) {
    return <LoadingContainer>No data available</LoadingContainer>;
  }

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

  const monthlyLabels = months.filter(
    (_, index) => chartData.monthly_data[index + 1]
  );
  const expenseData = monthlyLabels.map(
    (_, index) => chartData.monthly_data[index + 1]?.total_expense || 0
  );
  const paidData = monthlyLabels.map(
    (_, index) => chartData.monthly_data[index + 1]?.total_paid || 0
  );

  const barChartData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: "Total Expenses",
        data: expenseData,
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
      {
        label: "Total Paid",
        data: paidData,
        backgroundColor: "rgba(34, 197, 94, 0.5)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 1,
      },
    ],
  };

  const lineChartData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: "Expense Trend",
        data: expenseData,
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
      },
      {
        label: "Payment Trend",
        data: paidData,
        borderColor: "rgba(34, 197, 94, 1)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Monthly Expenses - ${chartData.year}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <ChartsContainer>
      <ChartCard>
        <ChartTitle>Monthly Expenses (Bar Chart)</ChartTitle>
        <Bar data={barChartData} options={chartOptions} />
      </ChartCard>

      <ChartCard>
        <ChartTitle>Expense Trends (Line Chart)</ChartTitle>
        <Line data={lineChartData} options={chartOptions} />
      </ChartCard>
    </ChartsContainer>
  );
}