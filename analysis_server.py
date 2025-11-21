import os
import time
import numpy as np
import librosa
import soundfile as sf
from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client, Client
from dotenv import load_dotenv

# Load variables from .env file
load_dotenv()

# Read Supabase credentials
SUPABASE_URL = os.getenv("SUPABASE_URL", "").strip()
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "").strip()

print("SUPABASE_URL:", repr(SUPABASE_URL))
print("SUPABASE_KEY starts with:", SUPABASE_KEY[:10] if SUPABASE_KEY else None)

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Missing Supabase environment variables")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = Flask(__name__)
CORS(app)

# Example /analyze route
@app.route("/analyze", methods=["POST"])
def analyze():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    user_id = request.form.get("user_id")
    song_id = request.form.get("song_id")

    # Save temp file
    temp_path = f"/tmp/{file.filename}"
    file.save(temp_path)

    # Load audio with librosa
    y, sr = librosa.load(temp_path, sr=None)

    # Example metrics
    duration = librosa.get_duration(y=y, sr=sr)
    tempo, _ = librosa.beat.beat_track(y=y, sr=sr)

    result = {
        "duration_sec": duration,
        "tempo_bpm": tempo,
        "ai_confidence": float(np.random.rand()),  # placeholder
        "market_viability": float(np.random.rand()),  # placeholder
    }

    # If user_id and song_id provided, insert into Supabase
    if user_id and song_id:
        supabase.table("ai_event_entries").insert({
            "user_id": user_id,
            "song_id": song_id,
            "metrics": result,
            "created_at": time.strftime("%Y-%m-%d %H:%M:%S")
        }).execute()

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)

