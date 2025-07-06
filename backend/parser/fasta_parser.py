from Bio import SeqIO
from datetime import datetime
import sys
import os

# Add parent directory to path for database import
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from db.database import get_db_connection

def parse_and_store_fasta(file_path, file_name=None):
    """Parse FASTA file and store sequences in database"""
    results = []
    
    conn = get_db_connection()
    c = conn.cursor()

    for record in SeqIO.parse(file_path, "fasta"):
        sequence = str(record.seq)
        
        # Store in database
        c.execute("""
            INSERT INTO fasta_sequences (seq_id, description, sequence, length, uploaded_at, file_name)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            record.id,
            record.description,
            sequence,
            len(record.seq),
            datetime.now(),
            file_name
        ))
        
        # Add to results for return
        results.append({
            "id": record.id,
            "description": record.description,
            "length": len(record.seq),
            "sequence": sequence[:100] + "..." if len(sequence) > 100 else sequence
        })

    conn.commit()
    conn.close()
    return results

if __name__ == "__main__":
    if len(sys.argv) > 1:
        parsed = parse_and_store_fasta(sys.argv[1])
        print(f"Processed {len(parsed)} sequences")
        for entry in parsed:
            print(f"ID: {entry['id']}, Length: {entry['length']}")