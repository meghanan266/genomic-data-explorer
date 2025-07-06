import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Tabs,
  Tab,
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Chip,
} from "@mui/material";
import { BarChart3, Upload, FileText } from "lucide-react";
import FileUploader from "./components/FileUploader";
import Dashboard from "./components/Dashboard";
import "./App.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f8fafc",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
  },
});

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          backgroundColor: "background.default",
        }}
      >
        <AppBar
          position="static"
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <Toolbar>
            <Typography
              variant="h5"
              component="div"
              sx={{ flexGrow: 1, fontWeight: 600 }}
            >
              🧬 Genomic Data Explorer
            </Typography>
            <Chip
              label="BETA"
              size="small"
              sx={{
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "white",
                fontWeight: "bold",
              }}
            />
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ pt: 3, pb: 4 }}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              backgroundColor: "white",
              borderRadius: "12px 12px 0 0",
              px: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{
                "& .MuiTab-root": {
                  minHeight: 64,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 500,
                },
              }}
            >
              <Tab
                icon={<BarChart3 size={20} />}
                label="Dashboard"
                iconPosition="start"
              />
              <Tab
                icon={<FileText size={20} />}
                label="Upload FASTA"
                iconPosition="start"
              />
              <Tab
                icon={<Upload size={20} />}
                label="Upload VCF"
                iconPosition="start"
              />
            </Tabs>
          </Box>

          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: "0 0 12px 12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              minHeight: "70vh",
            }}
          >
            <TabPanel value={tabValue} index={0}>
              <Dashboard />
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <FileUploader type="fasta" />
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <FileUploader type="vcf" />
            </TabPanel>
          </Box>
        </Container>

        <Box
          sx={{
            backgroundColor: "grey.100",
            py: 3,
            mt: 4,
            textAlign: "center",
            borderTop: "1px solid",
            borderColor: "grey.200",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Built with React, Flask, and Biopython • Genomic Data Explorer ©
            2025
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
