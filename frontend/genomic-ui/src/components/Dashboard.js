import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { RotateCcw, Database, FileText, BarChart3 } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/stats");
      setStats(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load statistics. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !stats) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 4,
        }}
      >
        <CircularProgress size={60} />
        <Typography sx={{ mt: 2 }}>Loading dashboard...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={fetchStats}
          startIcon={<RotateCcw size={16} />}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  const variantTypeData = stats?.vcf_details?.variant_types || {};
  const pieData = {
    labels: Object.keys(variantTypeData),
    datasets: [
      {
        data: Object.values(variantTypeData),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" gutterBottom>
          📊 Genomic Data Dashboard
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={fetchStats}
          disabled={loading}
          startIcon={
            loading ? <CircularProgress size={16} /> : <RotateCcw size={16} />
          }
        >
          Refresh
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: "100%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <FileText size={24} />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  FASTA
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                {stats?.fasta_sequences || 0}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                sequences uploaded
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: "100%",
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Database size={24} />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  VCF
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                {stats?.vcf_variants || 0}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                variants discovered
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: "100%",
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <BarChart3 size={24} />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Chromosomes
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                {Object.keys(stats?.vcf_details?.chromosomes || {}).length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                unique chromosomes
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: "100%",
              background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
              color: "white",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <FileText size={24} />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Types
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                {Object.keys(variantTypeData).length || 0}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                variant types
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* No Data Message */}
        {!stats?.fasta_sequences && !stats?.vcf_variants && (
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ textAlign: "center", py: 6 }}>
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  🧬 Welcome to Genomic Data Explorer!
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Upload some FASTA or VCF files to see analytics and
                  visualizations here.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Navigate to the "Upload FASTA" or "Upload VCF" tabs to get
                  started.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Variant Types Pie Chart */}
        {Object.keys(variantTypeData).length > 0 && (
          <Grid item xs={12} md={6}>
            <Card sx={{ height: 400 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🔬 Variant Type Distribution
                </Typography>
                <Box
                  sx={{
                    height: 300,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Pie data={pieData} options={pieOptions} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Chromosome Distribution */}
        {stats?.vcf_details?.chromosomes && (
          <Grid item xs={12} md={6}>
            <Card sx={{ height: 400 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📊 Top Chromosomes by Variant Count
                </Typography>
                <Box sx={{ maxHeight: 300, overflow: "auto" }}>
                  {Object.entries(stats.vcf_details.chromosomes)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 10)
                    .map(([chr, count], index) => (
                      <Box
                        key={chr}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          py: 1,
                          px: 2,
                          mb: 1,
                          backgroundColor:
                            index % 2 === 0
                              ? "rgba(0,0,0,0.02)"
                              : "transparent",
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="body1">
                          Chromosome {chr}
                        </Typography>
                        <Typography variant="h6" color="primary">
                          {count}
                        </Typography>
                      </Box>
                    ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Quick Stats Summary */}
        {(stats?.fasta_sequences > 0 || stats?.vcf_variants > 0) && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📈 Quick Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">
                      Most Common Variant Type:
                    </Typography>
                    <Typography variant="h6">
                      {Object.entries(variantTypeData).length > 0
                        ? Object.entries(variantTypeData).sort(
                            ([, a], [, b]) => b - a
                          )[0]?.[0] || "N/A"
                        : "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">
                      Chromosome with Most Variants:
                    </Typography>
                    <Typography variant="h6">
                      {stats?.vcf_details?.chromosomes
                        ? `Chr ${
                            Object.entries(stats.vcf_details.chromosomes).sort(
                              ([, a], [, b]) => b - a
                            )[0]?.[0] || "N/A"
                          }`
                        : "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">
                      Total Data Points:
                    </Typography>
                    <Typography variant="h6">
                      {(stats?.fasta_sequences || 0) +
                        (stats?.vcf_variants || 0)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Dashboard;
