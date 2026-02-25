from pathlib import Path

# CONFIG
IMAGE_DIR = Path("./img")
OUTPUT_FILE = Path("./images.js")
VALID_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"}

def main():
    if not IMAGE_DIR.exists():
        raise FileNotFoundError(f"{IMAGE_DIR} does not exist.")

    image_files = sorted(
        f for f in IMAGE_DIR.iterdir()
        if f.is_file() and f.suffix.lower() in VALID_EXTENSIONS
    )

    lines = []

    for index, f in enumerate(image_files, start=1):
        line = f'{{ id: "Image {index}", image: require("./img/{f.name}") }},'
        lines.append(line)

    OUTPUT_FILE.write_text("\n".join(lines), encoding="utf-8")
    print("images.js generated successfully.")

if __name__ == "__main__":
    main()