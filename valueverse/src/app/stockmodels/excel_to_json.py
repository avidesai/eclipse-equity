import os
import pandas as pd
import json
import matplotlib.pyplot as plt

# Get the directory of the script and build the file paths
script_dir = os.path.dirname(__file__)
excel_file_path = os.path.join(script_dir, "ABNB.xlsx")
output_json_file_path = os.path.join(script_dir, "ABNB.json")

# Read the Excel file (specifically the "DCF Model" sheet)
df = pd.read_excel(excel_file_path, sheet_name="DCF Model", header=None)

# Save the entire DataFrame as an image for easier inspection
fig, ax = plt.subplots(figsize=(20, len(df) * 0.5))  # Adjust height dynamically for the number of rows
ax.axis('off')
table = ax.table(cellText=df.values,
                 colLabels=[f"Col {i}" for i in range(df.shape[1])],
                 rowLabels=[f"Row {i}" for i in range(df.shape[0])],
                 loc='center',
                 cellLoc='center')
table.auto_set_font_size(False)
table.set_fontsize(8)

# Save the table as an image
image_path = os.path.join(script_dir, "full_dataframe_visual.png")
plt.savefig(image_path, bbox_inches='tight', dpi=300)
print(f"Entire DataFrame saved as an image at {image_path}")

# Output the entire DataFrame to visually inspect the data
print("DataFrame content:")
print(df)

# Extract values from the Excel sheet based on positions (adjust these indices as necessary)
json_data = {
    "symbol": "ABNB",  # Hardcoded for this example
    "name": "Airbnb, Inc.",  # Hardcoded for this example
    "price": df.iloc[2, 0],  # Updated based on Excel screenshot
    "change": df.iloc[3, 0],  # Updated based on Excel screenshot
    "changePercent": df.iloc[3, 0],  # Updated based on Excel screenshot
    "logo": "🏠",  # Hardcoded for this example
    "marketCap": df.iloc[4, 0],  # Updated based on Excel screenshot
    "enterpriseValue": df.iloc[3, 8],  # Updated based on Excel screenshot
    "roic": df.iloc[5, 4],  # Updated based on Excel screenshot
    "revenue": {
        "current": df.iloc[9, 4],  # Revenue 2023
        "growth": df.iloc[10, 4],  # Revenue Growth 2024
        "cagr": df.iloc[10, 10],  # Revenue CAGR
    },
    "netIncome": {
        "current": df.iloc[14, 4],  # Net Income 2023
        "growth": df.iloc[15, 4],  # Net Income Growth 2024
        "cagr": df.iloc[15, 10],  # Net Income CAGR
    },
    "fcf": {
        "current": df.iloc[17, 4],  # FCF 2023
        "growth": df.iloc[18, 4],  # FCF Growth 2024
        "cagr": df.iloc[18, 10],  # FCF CAGR
    },
    "grossMargin": df.iloc[2, 4],  # Gross Margin %
    "netMargin": df.iloc[3, 4],  # Net Margin %
    "fcfMargin": df.iloc[4, 4],  # FCF Margin %
    "psRatio": df.iloc[2, 2],  # P/S
    "peRatio": df.iloc[3, 2],  # P/E
    "fcfYield": df.iloc[4, 2],  # FCF Yield
    "cash": df.iloc[3, 6],  # Cash
    "debt": df.iloc[4, 6],  # Total Debt
    "netCash": df.iloc[5, 6],  # Net Cash
    "terminalValue": df.iloc[2, 8],  # Terminal Value
    "intrinsicValue": df.iloc[4, 10],  # Intrinsic Value
    "upside": df.iloc[5, 10],  # Upside %
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
        }
    ]
}

# Write the JSON object to a file
with open(output_json_file_path, 'w') as json_file:
    json.dump(json_data, json_file, indent=2)

print("JSON data has been successfully extracted and saved to", output_json_file_path)
