from Bio import SeqIO

def parse_fasta(file_path):
    results = []
    for record in SeqIO.parse(file_path, "fasta"):
        results.append({
            "id": record.id,
            "description": record.description,
            "length": len(record.seq),
            "sequence": str(record.seq[:50]) + "..."  # preview
        })
    return results

if __name__ == "__main__":
    parsed = parse_fasta("../data/sample.fasta")
    for entry in parsed:
        print(entry)
