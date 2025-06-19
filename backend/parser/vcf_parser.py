def parse_vcf(file_path):
    snps = []
    with open(file_path, 'r') as file:
        for line in file:
            if line.startswith("#"):
                continue
            fields = line.strip().split('\t')
            chromosome = fields[0]
            position = fields[1]
            ref = fields[3]
            alt = fields[4]
            snps.append({
                "chromosome": chromosome,
                "position": position,
                "ref": ref,
                "alt": alt
            })
    return snps

if __name__ == "__main__":
    parsed = parse_vcf("../data/sample.vcf")
    for snp in parsed:
        print(snp)
