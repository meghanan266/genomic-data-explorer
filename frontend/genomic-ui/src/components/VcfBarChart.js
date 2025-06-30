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
        borderRadius: 4,
      },
    ],
  };

  return (
    <Box sx={{ maxWidth: 700, mt: 4, mx: "auto" }}>
      <Typography variant="h6" gutterBottom>
        Variants by Chromosome
      </Typography>
      <Bar data={chartData} />
    </Box>
  );
  
};

export default VcfBarChart;
