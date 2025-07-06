import os
import sys
from datetime import datetime

# Add parent directory to path for database import
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from db.database import get_db_connection

def parse_and_store_vcf(file_path, file_name=None):
    """Parse VCF file and store variants in database"""
    variants = []
    
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"VCF file not found: {file_path}")
    
    conn = get_db_connection()
    c = conn.cursor()
    
    with open(file_path, 'r') as file:
        for line_num, line in enumerate(file, 1):
            line = line.strip()
            
            # Skip header lines and empty lines
            if line.startswith('#') or not line:
                continue
            
            try:
                # Split by tab or whitespace
                fields = line.split('\t') if '\t' in line else line.split()
                
                if len(fields) < 5:
                    continue
                
                # Extract VCF fields
                chromosome = fields[0]
                position = int(fields[1]) if fields[1].isdigit() else None
                ref = fields[3]
                alt = fields[4]
                quality = float(fields[5]) if len(fields) > 5 and fields[5] != '.' else None
                info = fields[7] if len(fields) > 7 else None
                
                if position is None:
                    continue
                
                variant_data = {
                    "chromosome": chromosome,
                    "position": position,
                    "ref": ref,
                    "alt": alt,
                    "quality": quality,
                    "info": info
                }
                
                variants.append(variant_data)
                
                # Insert into database
                c.execute("""
                    INSERT INTO vcf_variants 
                    (chromosome, position, ref, alt, quality, info, uploaded_at, file_name)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    chromosome, position, ref, alt, quality, 
                    info, datetime.now(), file_name
                ))
                
            except (ValueError, IndexError):
                continue
    
    conn.commit()
    conn.close()
    
    print(f"Successfully parsed {len(variants)} variants")
    return variants

def get_vcf_stats():
    """Get summary statistics for VCF data"""
    conn = get_db_connection()
    c = conn.cursor()
    
    # Total variants
    c.execute("SELECT COUNT(*) FROM vcf_variants")
    total_variants = c.fetchone()[0]
    
    # Variants by chromosome
    c.execute("""
        SELECT chromosome, COUNT(*) as count 
        FROM vcf_variants 
        GROUP BY chromosome 
        ORDER BY count DESC
    """)
    chr_counts = c.fetchall()
    
    # Variant types
    c.execute("""
        SELECT 
            CASE 
                WHEN LENGTH(ref) = 1 AND LENGTH(alt) = 1 THEN 'SNP'
                WHEN LENGTH(ref) < LENGTH(alt) THEN 'Insertion'
                WHEN LENGTH(ref) > LENGTH(alt) THEN 'Deletion'
                ELSE 'Complex'
            END as variant_type,
            COUNT(*) as count
        FROM vcf_variants 
        GROUP BY variant_type
    """)
    variant_types = c.fetchall()
    
    conn.close()
    
    return {
        "total_variants": total_variants,
        "chromosomes": dict(chr_counts),
        "variant_types": dict(variant_types)
    }

if __name__ == "__main__":
    if len(sys.argv) > 1:
        results = parse_and_store_vcf(sys.argv[1])
        stats = get_vcf_stats()
        print("Stats:", stats)