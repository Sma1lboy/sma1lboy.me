#!/bin/bash

# Check if FFmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "FFmpeg is not installed. Please install it first."
    exit 1
fi

# Function to convert video to GIF
convert_to_gif() {
    local video="$1"
    local output="${video%.*}.gif"
    echo "Processing file: $video"
    if [ ! -f "$output" ] || [ "$video" -nt "$output" ]; then
        echo "Converting '$video' to '$output'"
        ffmpeg -i "$video" -vf "fps=10,scale=800:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 "$output"
    else
        echo "Skipping '$video' as '$output' is up to date"
    fi
}

# Function to update references in a single Markdown file
update_references() {
    local file="$1"
    echo "Updating references in $file"
    sed -i'.bak' -E 's/(\[.*\]\(assets\/.*\.)mov\)/\1gif)/g' "$file"
    rm "${file}.bak"
}

# Convert videos to GIFs
while IFS= read -r -d '' video
do
    convert_to_gif "$video"
done < <(find assets -type f \( -iname "*.mov" -o -iname "*.mp4" \) -print0)

echo "Video conversion process completed."

# Update Markdown references
echo "Updating Markdown references..."
find . -type f -name "*.md" -print0 | while IFS= read -r -d '' file
do
    update_references "$file"
done

echo "Markdown files have been updated."
echo "All tasks completed successfully."