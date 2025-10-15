#!/bin/bash
echo "Manual review needed for these files:"
echo "====================================="

# Show remaining .map() calls that might need keys
grep -rn "\.map(" src --include="*.jsx" | while read -r line; do
    file=$(echo "$line" | cut -d: -f1)
    line_num=$(echo "$line" | cut -d: -f2)
    
    # Show context around the line
    echo "File: $file:$line_num"
    echo "Context:"
    sed -n "$((line_num-1)),$((line_num+3))p" "$file" | cat -n
    echo "---"
done
