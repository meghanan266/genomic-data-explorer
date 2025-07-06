import sqlite3
from pathlib import Path

# Database path
DATABASE_PATH = Path(__file__).parent / "genomics.db"

def get_db_connection():
    """Get database connection"""
    return sqlite3.connect(str(DATABASE_PATH))

def init_db():
    """Initialize database tables"""
    conn = get_db_connection()
    c = conn.cursor()

    # FASTA sequences table
    c.execute("""
        CREATE TABLE IF NOT EXISTS fasta_sequences (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            seq_id TEXT NOT NULL,
            description TEXT,
            sequence TEXT NOT NULL,
            length INTEGER NOT NULL,
            uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            file_name TEXT
        );
    """)

    # VCF variants table
    c.execute("""
        CREATE TABLE IF NOT EXISTS vcf_variants (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            chromosome TEXT NOT NULL,
            position INTEGER NOT NULL,
            ref TEXT NOT NULL,
            alt TEXT NOT NULL,
            quality REAL,
            info TEXT,
            uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            file_name TEXT
        );
    """)
    
    # Create indexes for better performance
    c.execute("CREATE INDEX IF NOT EXISTS idx_chromosome ON vcf_variants(chromosome);")
    c.execute("CREATE INDEX IF NOT EXISTS idx_position ON vcf_variants(position);")
    
    conn.commit()
    conn.close()
    print("Database initialized successfully")

if __name__ == "__main__":
    init_db()