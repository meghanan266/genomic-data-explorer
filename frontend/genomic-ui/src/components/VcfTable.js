import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";

const VcfTable = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Typography sx={{ textAlign: "center", mt: 2, color: "text.secondary" }}>
        No VCF data to show.
      </Typography>
    );
  }

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "chromosome", headerName: "Chr", width: 100 },
    { field: "position", headerName: "Position", width: 140, type: "number" },
    { field: "ref", headerName: "Ref", width: 120 },
    { field: "alt", headerName: "Alt", width: 120 },
    { field: "quality", headerName: "Quality", width: 120, type: "number" },
    { field: "info", headerName: "Info", flex: 1, minWidth: 300 },
  ];

  const rows = data.map((row, index) => ({
    id: index + 1,
    ...row,
  }));

  return (
    <Box sx={{ width: "100%", mt: 4, mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        🧬 VCF Variant Table ({data.length} variants)
      </Typography>
      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 25 },
            },
          }}
          pageSizeOptions={[10, 25, 50, 100]}
          checkboxSelection={false}
          disableRowSelectionOnClick
          sx={{
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #f0f0f0",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f5f5f5",
              fontWeight: "bold",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default VcfTable;
