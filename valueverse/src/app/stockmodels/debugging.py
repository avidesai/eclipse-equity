import pandas as pd
import os

# Get the directory of the script and build the file paths
script_dir = os.path.dirname(__file__)
excel_file_path = os.path.join(script_dir, "ABNB.xlsx")
output_json_file_path = os.path.join(script_dir, "ABNB.json")

# Read the Excel file
df = pd.read_excel(excel_file_path, sheet_name="DCF Model", header=None)

# Replace tools.display_dataframe_to_user with print
print("Inspecting relevant rows and columns:")
print(df.iloc[0:25, 4:11])  # Simple print instead of custom display

# Debug specific fields
print("roic cell:", df.iloc[6, 4])
print("cagr for revenue cell:", df.iloc[11, 10])
print("cagr for net income cell:", df.iloc[16, 10])
print("cagr for fcf cell:", df.iloc[19, 10])
print("net cash cell:", df.iloc[6, 6])
print("upside cell:", df.iloc[6, 10])
print("historicalMetrics (first year):")
print("  revenue cell:", df.iloc[10, 1])
print("  netIncome cell:", df.iloc[15, 1])
print("  fcf cell:", df.iloc[18, 1])
print("  shares cell:", df.iloc[21, 1])
