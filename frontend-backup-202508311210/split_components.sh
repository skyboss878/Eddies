#!/bin/bash

input_file="src/pages/VehicleDetail.jsx"
output_dir="src/pages/split_components"
mkdir -p "$output_dir"

awk '
  /^export default function/ {
    # Extract component name
    match($0, /export default function ([^(]*)/, arr);
    if (component) close(out_file);
    component = arr[1];
    out_file = "'$output_dir'/" component ".jsx";
    print $0 > out_file;
    next;
  }
  {
    if (component) print $0 > out_file;
  }
' "$input_file"
