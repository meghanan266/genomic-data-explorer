import sqlite3
from datetime import datetime
import re

def parse_and_store_vcf(file_path):
    snps = []
    conn = sqlite3.connect("db/genomics.db")
    c = conn.cursor()

    with open(file_path, 'r') as file:
        for line in file:
            if line.startswith("#"):
                continue
            fields = re.split(r'\s+', line.strip())
            snp_data = {
                "chromosome": fields[0],
                "position": fields[1],
                "ref": fields[3],
                "alt": fields[4]
            }
            snps.append(snp_data)

            # DB insert
            c.execute("""
                INSERT INTO vcf_variants (chromosome, position, ref, alt, uploaded_at)
                VALUES (?, ?, ?, ?, ?)
            """, (
                snp_data["chromosome"],
                snp_data["position"],
                snp_data["ref"],
                snp_data["alt"],
                datetime.now()
            ))

    conn.commit()
    conn.close()
    return snps

if __name__ == "__main__":
    parsed = parse_and_store_vcf("../data/sample.vcf")
    for snp in parsed:
        print(snp)
