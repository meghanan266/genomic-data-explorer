import sqlite3
from datetime import datetime

def init_db():
    conn = sqlite3.connect("db/genomics.db")
    c = conn.cursor()

    # FASTA table
    c.execute("""
        CREATE TABLE IF NOT EXISTS fasta_sequences (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            seq_id TEXT,
            description TEXT,
            sequence TEXT,
            length INTEGER,
            uploaded_at DATETIME
        );
    """)

    # VCF table
    c.execute("""
        CREATE TABLE IF NOT EXISTS vcf_variants (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            chromosome TEXT,
            position TEXT,
            ref TEXT,
            alt TEXT,
            uploaded_at DATETIME
        );
    """)

    conn.commit()
    conn.close()
    print("✅ Database initialized.")

if __name__ == "__main__":
    init_db()
