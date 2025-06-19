from Bio import SeqIO
import sqlite3
from datetime import datetime

def parse_and_store_fasta(file_path):
    results = []
    conn = sqlite3.connect("db/genomics.db")
    c = conn.cursor()

    for record in SeqIO.parse(file_path, "fasta"):
        seq_data = {
            "id": record.id,
            "description": record.description,
            "length": len(record.seq),
            "sequence": str(record.seq[:50]) + "..."
        }
        results.append(seq_data)

        # DB insert
        c.execute("""
            INSERT INTO fasta_sequences (seq_id, description, sequence, length, uploaded_at)
            VALUES (?, ?, ?, ?, ?)
        """, (
            seq_data["id"],
            seq_data["description"],
            seq_data["sequence"],
            seq_data["length"],
            datetime.now()
        ))

    conn.commit()
    conn.close()
    return results

if __name__ == "__main__":
    parsed = parse_and_store_fasta("../data/sample.fasta")
    for entry in parsed:
        print(entry)
