import os
import tempfile
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from parser.fasta_parser import parse_and_store_fasta
from parser.vcf_parser import parse_and_store_vcf, get_vcf_stats
from db.database import init_db, get_db_connection

app = Flask(__name__)
CORS(app)

# Configuration
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
ALLOWED_EXTENSIONS = {'fasta', 'fa', 'vcf', 'txt'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Initialize database when app starts
init_db()

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get database statistics"""
    conn = get_db_connection()
    c = conn.cursor()
    
    # FASTA stats
    c.execute("SELECT COUNT(*) FROM fasta_sequences")
    fasta_count = c.fetchone()[0]
    
    # VCF stats
    vcf_stats = get_vcf_stats()
    
    conn.close()
    
    return jsonify({
        "fasta_sequences": fasta_count,
        "vcf_variants": vcf_stats["total_variants"] if vcf_stats else 0,
        "vcf_details": vcf_stats
    })

@app.route("/parse/fasta", methods=["POST"])
def parse_fasta_api():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']
    if file.filename == '' or not allowed_file(file.filename):
        return jsonify({"error": "Invalid file"}), 400
    
    # Create temporary file 
    filename = secure_filename(file.filename)
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=f"_{filename}")
    temp_path = temp_file.name
    
    try:
        # Save and process file
        file.save(temp_path)
        temp_file.close()
        
        parsed_data = parse_and_store_fasta(temp_path, filename)
        return jsonify(parsed_data)
        
    finally:
        # Clean up temporary file
        try:
            os.unlink(temp_path)
        except:
            pass

@app.route("/parse/vcf", methods=["POST"])
def parse_vcf_api():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']
    if file.filename == '' or not allowed_file(file.filename):
        return jsonify({"error": "Invalid file"}), 400
    
    # Create temporary file 
    filename = secure_filename(file.filename)
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=f"_{filename}")
    temp_path = temp_file.name
    
    try:
        # Save and process file
        file.save(temp_path)
        temp_file.close()
        
        parsed_data = parse_and_store_vcf(temp_path, filename)
        return jsonify(parsed_data)
        
    finally:
        # Clean up temporary file
        try:
            os.unlink(temp_path)
        except:
            pass

@app.errorhandler(413)
def too_large(e):
    return jsonify({"error": "File too large. Maximum size is 16MB."}), 413

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)