from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

# Placeholder data for different locations
LOCATION_DATA = {
    "location1": {
        "timestamp": pd.date_range("2024-11-10", periods=100, freq="H").strftime("%Y-%m-%d %H:%M:%S").tolist(),
        "air_quality_index": np.random.randint(50, 200, size=100).tolist(),
        "temperature": np.random.uniform(15, 35, size=100).tolist(),
        "humidity": np.random.uniform(30, 90, size=100).tolist()
    },
    "location2": {
        "timestamp": pd.date_range("2024-11-10", periods=100, freq="H").strftime("%Y-%m-%d %H:%M:%S").tolist(),
        "air_quality_index": np.random.randint(50, 200, size=100).tolist(),
        "temperature": np.random.uniform(10, 30, size=100).tolist(),
        "humidity": np.random.uniform(40, 80, size=100).tolist()
    }
}

@app.route('/api/environmental_data', methods=['GET'])
def get_environmental_data():
    try:
        location = request.args.get('location', 'location1')  # Default to location1
        # Fetch data for the given location
        if location in LOCATION_DATA:
            return jsonify(LOCATION_DATA[location])
        else:
            return jsonify({"error": "Location not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/anomaly_detection', methods=['POST'])
def anomaly_detection():
    try:
        data = request.json
        if "values" not in data:
            return jsonify({"error": "Missing 'values' in request data"}), 400

        values = np.array(data["values"]).reshape(-1, 1)
        model = IsolationForest(contamination=0.1)
        predictions = model.fit_predict(values)

        anomalies = [i for i, p in enumerate(predictions) if p == -1]
        return jsonify({"anomalies": anomalies})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/trends', methods=['GET'])
def get_trends():
    try:
        trend_type = request.args.get('type', 'daily')  # Default to daily
        location = request.args.get('location', 'location1')  # Get location from query parameters

        # Ensure location exists in the data
        if location not in LOCATION_DATA:
            return jsonify({"error": "Location not found"}), 404

        df = pd.DataFrame(LOCATION_DATA[location])
        df['timestamp'] = pd.to_datetime(df['timestamp'])

        if trend_type == 'daily':
            trend = df.groupby(df['timestamp'].dt.date).mean().reset_index()
        elif trend_type == 'weekly':
            trend = df.groupby(df['timestamp'].dt.isocalendar().week).mean().reset_index()
        elif trend_type == 'monthly':
            trend = df.groupby(df['timestamp'].dt.month).mean().reset_index()
        else:
            return jsonify({"error": "Invalid trend type"}), 400

        return jsonify(trend.to_dict(orient='list'))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
