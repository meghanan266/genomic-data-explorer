from flask import Flask, request, jsonify
from flask_cors import CORS
from parser.fasta_parser import parse_and_store_fasta
from parser.vcf_parser import parse_and_store_vcf
import tempfile

app = Flask(__name__)
CORS(app)  # Allow frontend to call the API (cross-origin requests)

@app.route("/parse/fasta", methods=["POST"])
def parse_fasta_api():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file provided"}), 400
    
    with tempfile.NamedTemporaryFile(delete=False) as temp:
        file.save(temp.name)
        parsed_data = parse_and_store_fasta(temp.name)
    
    return jsonify(parsed_data)

@app.route("/parse/vcf", methods=["POST"])
def parse_vcf_api():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file provided"}), 400

    with tempfile.NamedTemporaryFile(delete=False) as temp:
        file.save(temp.name)
        parsed_data = parse_and_store_vcf(temp.name)

    return jsonify(parsed_data)

if __name__ == "__main__":
    app.run(debug=True)
