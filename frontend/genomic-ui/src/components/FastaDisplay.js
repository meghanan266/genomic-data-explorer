import React from "react";
import { Box, Card, CardContent, Typography, Chip } from "@mui/material";

const FastaDisplay = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Typography sx={{ textAlign: "center", mt: 2, color: "text.secondary" }}>
        No FASTA data to show.
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        🧬 FASTA Sequences ({data.length})
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {data.map((seq, index) => (
          <Card key={index} sx={{ borderLeft: "4px solid #1976d2" }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="h6" color="primary">
                  {seq.id}
                </Typography>
                <Chip
                  label={`${seq.length} bp`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>Description:</strong>{" "}
                {seq.description || "No description"}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>Sequence (preview):</strong>
              </Typography>

              <Box
                sx={{
                  backgroundColor: "#f5f5f5",
                  padding: 1,
                  borderRadius: 1,
                  fontFamily: "monospace",
                  fontSize: "0.875rem",
                  overflowX: "auto",
                  border: "1px solid #e0e0e0",
                }}
              >
                {seq.sequence}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default FastaDisplay;
