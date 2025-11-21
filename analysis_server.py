import os
import time
import numpy as np
import librosa
import soundfile as sf
from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client, Client

app = Flask(__name__)
CORS(app)

# Load Supabase credentials from environment variables
SUPABASE_URL = os.environ.get("https://imqfnxtornlvglwvkspi.supabase.co")
SUPABASE_KEY = os.environ.get("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltcWZueHRvcm5sdmdsd3Zrc3BpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzEzNDI2OSwiZXhwIjoyMDc4NzEwMjY5fQ.A_Dl8Q7PZDiAVUXOjnm3F8Fpdwt32pe_UbYL3sZJG34")  
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
