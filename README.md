# Environmental Monitoring System

## Overview

This Environmental Monitoring System provides real-time tracking of environmental parameters like Air Quality Index (AQI), Temperature, and Humidity. The system uses data gathered from different locations, performs anomaly detection using machine learning models, and generates trend reports. It provides a visual dashboard for viewing and analyzing environmental data over various time frames (daily, weekly, monthly). 

## Features

- **Real-time data display**: Visual representation of AQI, Temperature, and Humidity data over time.
- **Trend Analysis**: Generate daily, weekly, and monthly trends for AQI, Temperature, and Humidity.
- **Anomaly Detection**: Identify anomalies in environmental data using an Isolation Forest machine learning model.
- **Threshold Setting**: Users can set an air quality threshold for AQI and receive notifications if the threshold is exceeded.
- **Dark Mode**: Toggle dark mode for the dashboard.
- **Multiple Locations**: Support for different monitoring locations.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript (Chart.js for data visualization)
- **Backend**: Flask (Python), Flask-CORS for handling cross-origin requests
- **Machine Learning**: Isolation Forest (from scikit-learn for anomaly detection)
- **Database**: Placeholder data generated using pandas and NumPy (to simulate environmental data)

## Installation

### Prerequisites

Make sure you have Python 3.8+ installed and the following libraries:

- Flask
- Flask-CORS
- pandas
- numpy
- scikit-learn

### Steps

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-name>
