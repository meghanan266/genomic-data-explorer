// components/ExportButtons.js
import React from "react";
import { Button, ButtonGroup, Box } from "@mui/material";
import { Download, FileText } from "lucide-react";

const ExportButtons = ({ data, filename, type }) => {
  const exportToCSV = () => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers.map((header) => JSON.stringify(row[header] || "")).join(",")
      ),
    ].join("\n");

    downloadFile(csvContent, `${filename}.csv`, "text/csv");
  };

  const exportToJSON = () => {
    if (!data || data.length === 0) return;

    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, `${filename}.json`, "application/json");
  };

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!data || data.length === 0) return null;

  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <ButtonGroup variant="outlined" size="small">
        <Button startIcon={<Download size={16} />} onClick={exportToCSV}>
          Export CSV
        </Button>
        <Button startIcon={<FileText size={16} />} onClick={exportToJSON}>
          Export JSON
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default ExportButtons;
