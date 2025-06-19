import React from "react";

const FastaDisplay = ({ data }) => {
  if (!data || data.length === 0) return <p>No FASTA data to show.</p>;

  return (
    <div className="display-container">
      {data.map((seq, index) => (
        <div key={index} className="fasta-card">
          <h3>{seq.id}</h3>
          <p>
            <strong>Description:</strong> {seq.description}
          </p>
          <p>
            <strong>Length:</strong> {seq.length}
          </p>
          <p>
            <strong>Sequence (partial):</strong> <code>{seq.sequence}</code>
          </p>
        </div>
      ))}
    </div>
  );
};

export default FastaDisplay;
