import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Box, Typography } from "@mui/material";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const VcfBarChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  // Group variants by chromosome
  const counts = {};
  data.forEach(({ chromosome }) => {
    counts[chromosome] = (counts[chromosome] || 0) + 1;
  });

  const chartData = {
    labels: Object.keys(counts),
    datasets: [
      {
        label: "Variant Count",
        data: Object.values(counts),
        backgroundColor: "rgba(63, 81, 181, 0.6)",
        borderColor: "rgba(63, 81, 181, 1)",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Typography variant="h6" gutterBottom>
        📊 Variants by Chromosome
      </Typography>
      <Box sx={{ height: 250, width: "100%" }}>
        <Bar data={chartData} options={options} />
      </Box>
    </Box>
  );
};

export default VcfBarChart;
