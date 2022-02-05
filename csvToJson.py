# This script converts a downloaded Excel workbook of the ACNH community spreadsheet to
# the JSON format used in the webapp. Just place the spreadheet, named ""Data Spreadsheet for Animal Crossing New Horizons.xlsx"
# next to this script, and run the script (with its working directory being the directory containing it)
# The script will overwrite the .json files in /src/assets, or output an error.
# It's probably worth double checking that the column titles haven't changed in a new version of the sheet.

# This script requires Python 3 and openpyxl ("pip install openpyxl").

from openpyxl import load_workbook
from openpyxl.cell.cell import Cell
import json

wb = load_workbook("Data Spreadsheet for Animal Crossing New Horizons.xlsx")

sheets = [("Insects", "src/assets/insects.json"), ("Fish", "src/assets/fish.json"), ("Sea Creatures", "src/assets/seaCreatures.json")]

for (sheetName, fileName) in sheets:
    sheet = wb[sheetName]
    data = []
    fields = []
    hasFields = False
    for row in sheet.rows:
        cell: Cell
        if not hasFields:
            hasFields = True
            for cell in row:
                val: str = cell.value.lower()
                if val == "#": val = "index"
                elif val == "icon image": val = "iconImage"
                elif val == "critterpedia image": val = "critterpediaImage"
                elif val == "furniture image": val = "furnitureImage"
                elif val == "movement speed": val = "movementSpeed"
                elif val == "catch phrase": val = "catchMessages"
                elif val == "where/how": val = "location"
                elif val == "catch difficulty": val = "difficulty"
                elif val == "total catches to unlock": val = "catchesToUnlock"
                elif val == "spawn rates": val = "spawnRate"
                elif val == "hha base points": val = "hhaPoints"
                elif val == "hha category": val = "hhaCategory"
                elif val == "color 1": val = "color1"
                elif val == "color 2": val = "color2"
                elif val == "lighting type": val = "lightingType"
                elif val == "icon filename": val = "iconFilename"
                elif val == "critterpedia filename": val = "critterpediaFilename"
                elif val == "furniture filename": val = "furnitureFilename"
                elif val == "internal id": val = "internalID"
                elif val == "version added": val = "versionAdded"
                elif val == "unlocked?": val = "unlocked"
                elif val == "unique entry id": val = "spreadsheetID"
                fields.append(val)
        else:
            tmp = {}
            nhTimes = []
            shTimes = []
            fieldName: str
            for (fieldName, cell) in zip(fields, row):
                val = cell.value
                if isinstance(val, str): val = val.replace("All day", "All Day")
                #replace erroneous non-breaking spaces in time ranges with regular spaces
                if isinstance(val, str): val = val.replace("\xa0", " ").replace("\u2013", "-")
                #replace =@IMAGE functions with their URLs
                if isinstance(val, str) and val.find("=IMAGE") != -1:
                    val = val.replace("=IMAGE(\"", "").removesuffix("\")")
                #make critter names title case
                if fieldName == "name":
                    val = val.title().replace("'S", "'s")
                #turn catch phrase/time string into array
                if fieldName == "catchMessages" or fieldName.startswith("nh ") or fieldName.startswith("sh "):
                    val = val.split("; ")
                if fieldName == "surface" or fieldName == "unlocked":
                    val = val == "Yes"
                #times go in an array based on hemisphere 
                if fieldName.find("nh ") != -1:
                    tmp["nhTimes"] = nhTimes
                    nhTimes.append(val)
                elif fieldName.find("sh ") != -1:
                    tmp["shTimes"] = shTimes
                    shTimes.append(val)
                else:
                    tmp[fieldName] = val
            data.append(tmp)
    ans = ["[\n"]
    ans.extend(",\n".join(map(lambda o: "    "+json.dumps(o), data)))
    ans.append("\n]")
    with open(fileName, "w", encoding="UTF-8") as f:
        f.writelines(ans)
