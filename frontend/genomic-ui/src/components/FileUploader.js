import React, { useState } from "react";
import axios from "axios";
import FastaDisplay from "./FastaDisplay";
import VcfTable from "./VcfTable";
import { Button, Typography, Box } from "@mui/material";
import VcfBarChart from "./VcfBarChart";

const FileUploader = ({ type }) => {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const endpoint = type === "fasta" ? "/parse/fasta" : "/parse/vcf";

    try {
      const response = await axios.post(
        `http://localhost:5000${endpoint}`,
        formData
      );
      setParsedData(response.data);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="upload-box">
      <Typography variant="h6" sx={{ marginBottom: 1 }}>
        Upload {type.toUpperCase()} File
      </Typography>
      <Box sx={{ marginBottom: 1 }}>
        <input
          type="file"
          accept={type === "fasta" ? ".fasta" : ".vcf"}
          onChange={handleFileChange}
        />
      </Box>
      <Button
        variant="contained"
        onClick={handleUpload}
        sx={{ marginBottom: 2 }}
      >
        Upload
      </Button>
      {type === "fasta" && <FastaDisplay data={parsedData} />}
      {type === "vcf" && (
        <>
          <VcfTable data={parsedData} />
          <VcfBarChart data={parsedData} />
        </>
      )}
    </div>
  );
};

export default FileUploader;
