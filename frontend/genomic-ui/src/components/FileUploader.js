import React, { useState } from "react";
import axios from "axios";
import FastaDisplay from "./FastaDisplay";
import VcfTable from "./VcfTable";
import VcfBarChart from "./VcfBarChart";
import {
  Button,
  Typography,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const FileUploader = ({ type }) => {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [chromosomeFilter, setChromosomeFilter] = useState("");
  const [mutationFilter, setMutationFilter] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    const endpoint = type === "fasta" ? "/parse/fasta" : "/parse/vcf";

    try {
      const response = await axios.post(
        `http://localhost:5000${endpoint}`,
        formData
      );
      setParsedData(response.data);
      setError(null);
    } catch (error) {
      setError(
        error.response?.data?.error ||
          "Upload failed. Please check your file format and try again."
      );
      setParsedData([]);
    } finally {
      setLoading(false);
    }
  };

  const classifyMutation = (ref, alt) => {
    if (!ref || !alt || typeof ref !== "string" || typeof alt !== "string") {
      return "Unknown";
    }

    if (ref === "." || alt === "." || ref.length === 0 || alt.length === 0) {
      return "Unknown";
    }

    if (ref.length === 1 && alt.length === 1) return "SNP";
    else if (ref.length < alt.length) return "Insertion";
    else if (ref.length > alt.length) return "Deletion";
    else return "Other";
  };

  const filteredData =
    type === "vcf"
      ? parsedData.filter((item) => {
          if (!item || typeof item !== "object") {
            return false;
          }

          const mutationType = classifyMutation(item.ref, item.alt);
          const matchesChrom = chromosomeFilter
            ? item.chromosome === chromosomeFilter
            : true;
          const matchesMut = mutationFilter
            ? mutationType === mutationFilter
            : true;
          return matchesChrom && matchesMut;
        })
      : parsedData;

  const getUniqueChromosomes = () => {
    if (!Array.isArray(parsedData) || type !== "vcf") return [];

    return [
      ...new Set(
        parsedData.filter((d) => d && d.chromosome).map((d) => d.chromosome)
      ),
    ].sort();
  };

  return (
    <Box
      sx={{
        background: "#f9f9f9",
        padding: 3,
        borderRadius: 2,
        boxShadow: 2,
        width: "100%",
      }}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        Upload {type.toUpperCase()} File
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <input
          type="file"
          accept={type === "fasta" ? ".fasta,.fa,.txt" : ".vcf,.txt"}
          onChange={handleFileChange}
          style={{ flex: 1 }}
          disabled={loading}
        />
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={!file || loading}
        >
          {loading ? "Processing..." : "Upload"}
        </Button>
      </Box>

      {loading && (
        <Box sx={{ textAlign: "center", my: 2 }}>
          <Typography>Processing file...</Typography>
        </Box>
      )}

      {/* FASTA Display */}
      {type === "fasta" &&
        Array.isArray(parsedData) &&
        parsedData.length > 0 && <FastaDisplay data={parsedData} />}

      {/* VCF Display with Filters */}
      {type === "vcf" && Array.isArray(parsedData) && parsedData.length > 0 && (
        <>
          <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
            Filter Variants
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              alignItems: "center",
              mb: 3,
            }}
          >
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Chromosome</InputLabel>
              <Select
                value={chromosomeFilter}
                label="Chromosome"
                onChange={(e) => setChromosomeFilter(e.target.value)}
              >
                <MenuItem value="">All Chromosomes</MenuItem>
                {getUniqueChromosomes().map((chr) => (
                  <MenuItem key={chr} value={chr}>
                    {chr}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Mutation Type</InputLabel>
              <Select
                value={mutationFilter}
                label="Mutation Type"
                onChange={(e) => setMutationFilter(e.target.value)}
              >
                <MenuItem value="">All Mutation Types</MenuItem>
                <MenuItem value="SNP">SNP</MenuItem>
                <MenuItem value="Insertion">Insertion</MenuItem>
                <MenuItem value="Deletion">Deletion</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
                <MenuItem value="Unknown">Unknown</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              onClick={() => {
                setChromosomeFilter("");
                setMutationFilter("");
              }}
            >
              Reset Filters
            </Button>
          </Box>

          {filteredData.length > 0 ? (
            <Box sx={{ mt: 2 }}>
              {/* Chart and Stats Row */}
              <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <Box sx={{ flex: 3 }}>
                  <VcfBarChart data={filteredData} />
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: "#f5f5f5",
                      borderRadius: 2,
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="h4" color="primary">
                      {filteredData.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Variants
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: "#f5f5f5",
                      borderRadius: 2,
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="h4" color="primary">
                      {new Set(filteredData.map((v) => v.chromosome)).size}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Chromosomes
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: "#f5f5f5",
                      borderRadius: 2,
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="h4" color="primary">
                      {Math.round(
                        filteredData.reduce(
                          (sum, v) => sum + (v.quality || 0),
                          0
                        ) / filteredData.length
                      )}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Avg Quality
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Full Width Table */}
              <VcfTable data={filteredData} />
            </Box>
          ) : (
            <Typography sx={{ mt: 2, textAlign: "center" }}>
              No variants match the current filters.
            </Typography>
          )}
        </>
      )}

      {/* No Data Message */}
      {!loading &&
        Array.isArray(parsedData) &&
        parsedData.length === 0 &&
        !error && (
          <Typography
            sx={{ mt: 2, textAlign: "center", color: "text.secondary" }}
          >
            Upload a {type.toUpperCase()} file to see results here.
          </Typography>
        )}
    </Box>
  );
};

export default FileUploader;
