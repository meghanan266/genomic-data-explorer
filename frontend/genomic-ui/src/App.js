import React from "react";
import FileUploader from "./components/FileUploader";
import "./App.css";

function App() {
  return (
    <div className="App">
      <h1>Genomic Data Explorer</h1>
      <FileUploader type="fasta" />
      <FileUploader type="vcf" />
    </div>
  );
}

export default App;
