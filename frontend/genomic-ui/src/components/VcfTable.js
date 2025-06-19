import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";

const VcfTable = ({ data }) => {
  if (!data || data.length === 0)
    return <Typography>No VCF data to show.</Typography>;

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "chromosome", headerName: "Chromosome", width: 130 },
    { field: "position", headerName: "Position", width: 130 },
    { field: "ref", headerName: "Reference", width: 130 },
    { field: "alt", headerName: "Alternate", width: 130 },
  ];

  // Add row `id` as required by DataGrid
  const rows = data.map((row, index) => ({
    id: index + 1,
    ...row,
  }));

  return (
    <Box sx={{ height: 500, width: "100%", mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        VCF Variant Table (Search & Paginate)
      </Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        checkboxSelection={false}
        disableSelectionOnClick
      />
    </Box>
  );
};

export default VcfTable;
