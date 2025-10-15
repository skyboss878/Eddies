#!/bin/bash

# Simple, safe JSX fix for CreateJob.jsx
FILE="src/pages/CreateJob.jsx"

echo "Applying safe JSX fixes to $FILE..."

# Check if file exists
if [ ! -f "$FILE" ]; then
    echo "Error: $FILE not found!"
    exit 1
fi

# Create timestamped backup
BACKUP="${FILE}.backup.$(date +%Y%m%d_%H%M%S)"
cp "$FILE" "$BACKUP"
echo "Backup created: $BACKUP"

# Show current problematic area
echo "Current structure around the issue:"
sed -n '160,170p' "$FILE"
echo ""

# The issue is that </form> is in the wrong place
# It should be after BOTH customer and vehicle selects, not just customer

# Step 1: Remove the misplaced </form> tag (should be around line 166)
sed -i '/^[[:space:]]*<\/form>[[:space:]]*$/d' "$FILE"

# Step 2: The vehicle select section needs to be completed and then we close the form
# Let's find where the file currently ends and see what's missing

echo "Current end of file:"
tail -10 "$FILE"

echo ""
echo "Fixed: Removed misplaced </form> tag"
echo "Next: You'll need to manually complete the vehicle select section and add proper closing tags"
echo ""
echo "The structure should be:"
echo "  <select (vehicle)>"
echo "    <option>...</option>"
echo "    {vehicles.map...}"
echo "  </select>"
echo "</div>          <!-- close vehicle div -->"
echo "<!-- submit buttons here -->"
echo "</form>         <!-- close form -->"
echo "</div>          <!-- close main container -->"
echo ");"
echo "}"
echo "export default CreateJob;"
