import os
import pandas as pd
import json
# Get the directory of the script and build paths
script_dir = os.path.dirname(__file__)
models_dir = os.path.join(script_dir, "models")
output_dir = os.path.join(script_dir, "jsondata")
company_info_path = os.path.join(script_dir, "company_info.json")

# Load company information from the JSON file
with open(company_info_path, 'r') as f:
    company_info = json.load(f)

# Ensure the output directory exists
os.makedirs(output_dir, exist_ok=True)

# Iterate through all Excel files in the models directory
for filename in os.listdir(models_dir):
    if filename.endswith(".xlsx"):
        excel_file_path = os.path.join(models_dir, filename)
        output_json_file_path = os.path.join(output_dir, f"{os.path.splitext(filename)[0]}.json")
        
        # Read the Excel file (specifically the "DCF Model" sheet)
        df = pd.read_excel(excel_file_path, sheet_name="DCF Model", header=None)
        
        # Extract values from the Excel sheet based on positions
        json_data = {
            "symbol": company_info.get(filename, {}).get("symbol", "N/A"),  # Fallback to "N/A"
            "name": company_info.get(filename, {}).get("name", "Unknown Company"),  # Fallback to "Unknown Company"
            "logo": company_info.get(filename, {}).get("logo", "❓"),  # Fallback to "❓"
            "price": df.iloc[2, 0],
            "change": df.iloc[3, 0],
            "changePercent": df.iloc[3, 0],
            "marketCap": df.iloc[4, 0],
            "enterpriseValue": df.iloc[3, 8],
            "roic": df.iloc[5, 4],
            "revenue": {
                "current": df.iloc[9, 4],
                "growth": df.iloc[10, 4],
                "cagr": df.iloc[10, 10],
            },
            "netIncome": {
                "current": df.iloc[14, 4],
                "growth": df.iloc[15, 4],
                "cagr": df.iloc[15, 10],
            },
            "fcf": {
                "current": df.iloc[17, 4],
                "growth": df.iloc[18, 4],
                "cagr": df.iloc[18, 10],
            },
            "grossMargin": df.iloc[2, 4],
            "netMargin": df.iloc[3, 4],
            "fcfMargin": df.iloc[4, 4],
            "psRatio": df.iloc[2, 2],
            "peRatio": df.iloc[3, 2],
            "fcfYield": df.iloc[4, 2],
            "cash": df.iloc[3, 6],
            "debt": df.iloc[4, 6],
            "netCash": df.iloc[5, 6],
            "terminalValue": df.iloc[2, 8],
            "intrinsicValue": df.iloc[4, 10],
            "upside": df.iloc[5, 10],
            "historicalMetrics": [
                {
                    "year": int(df.iloc[8, 1]),
                    "revenue": df.iloc[9, 1],
                    "netIncome": df.iloc[14, 1],
                    "fcf": df.iloc[17, 1],
                    "shares": df.iloc[20, 1],
                },
                {
                    "year": int(df.iloc[8, 2]),
                    "revenue": df.iloc[9, 2],
                    "netIncome": df.iloc[14, 2],
                    "fcf": df.iloc[17, 2],
                    "shares": df.iloc[20, 2],
                },
                {
                    "year": int(df.iloc[8, 3]),
                    "revenue": df.iloc[9, 3],
                    "netIncome": df.iloc[14, 3],
                    "fcf": df.iloc[17, 3],
                    "shares": df.iloc[20, 3],
                },
                {
                    "year": int(df.iloc[8, 4]),
                    "revenue": df.iloc[9, 4],
                    "netIncome": df.iloc[14, 4],
                    "fcf": df.iloc[17, 4],
                    "shares": df.iloc[20, 4],
                },
            ],
            # Adding future metrics
            "futureMetrics": [
                {
                    "year": int(df.iloc[8, 5]),
                    "revenue": df.iloc[9, 5],
                    "netIncome": df.iloc[14, 5],
                    "fcf": df.iloc[17, 5],
                },
                {
                    "year": int(df.iloc[8, 6]),
                    "revenue": df.iloc[9, 6],
                    "netIncome": df.iloc[14, 6],
                    "fcf": df.iloc[17, 6],
                },
                {
                    "year": int(df.iloc[8, 7]),
                    "revenue": df.iloc[9, 7],
                    "netIncome": df.iloc[14, 7],
                    "fcf": df.iloc[17, 7],
                },
                {
                    "year": int(df.iloc[8, 8]),
                    "revenue": df.iloc[9, 8],
                    "netIncome": df.iloc[14, 8],
                    "fcf": df.iloc[17, 8],
                },
                {
                    "year": int(df.iloc[8, 9]),
                    "revenue": df.iloc[9, 9],
                    "netIncome": df.iloc[14, 9],
                    "fcf": df.iloc[17, 9],
                },
            ],
        }
        
        # Write the JSON object to a file
        with open(output_json_file_path, 'w') as json_file:
            json.dump(json_data, json_file, indent=2)
        print(f"JSON data has been successfully extracted and saved to {output_json_file_path}")