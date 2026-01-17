import argparse
import json
import os
from PIL import Image


def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def ensure_dir(path):
    os.makedirs(path, exist_ok=True)


def rotated_crop_rect(frame, source_size):
    w = frame["w"]
    h = frame["h"]

    if not source_size:
        return w, h

    source_w = source_size["w"]
    source_h = source_size["h"]

    # If rotated is true but frame size equals source size, assume the
    # frame rect needs swapping to match TexturePacker's rotated layout.
    if w == source_w and h == source_h and w != h:
        return h, w

    return w, h


def slice_frames(atlas_image, data, out_dir):
    frames = data.get("frames", {})
    for name, entry in frames.items():
        frame = entry["frame"]
        rotated = bool(entry.get("rotated", False))
        trimmed = bool(entry.get("trimmed", False))
        sprite_source = entry.get("spriteSourceSize", {"x": 0, "y": 0, "w": frame["w"], "h": frame["h"]})
        source_size = entry.get("sourceSize", {"w": frame["w"], "h": frame["h"]})

        x, y = frame["x"], frame["y"]
        crop_w, crop_h = frame["w"], frame["h"]
        if rotated:
            crop_w, crop_h = rotated_crop_rect(frame, source_size)

        crop = atlas_image.crop((x, y, x + crop_w, y + crop_h))

        if rotated:
            # TexturePacker rotated sprites are stored 90deg clockwise.
            # Rotate back counter-clockwise to restore original orientation.
            crop = crop.rotate(90, expand=True)

        if trimmed:
            out = Image.new("RGBA", (source_size["w"], source_size["h"]), (0, 0, 0, 0))
            out.paste(crop, (sprite_source["x"], sprite_source["y"]))
        else:
            out = crop

        out_path = os.path.join(out_dir, f"{name}.png")
        out.save(out_path)


def main():
    root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    default_json = os.path.join(root, "cocos", "assets", "images", "player", "player.json")
    default_image = os.path.join(root, "cocos", "assets", "images", "player", "player.webp")
    default_out = os.path.join(root, "cocos", "assets", "images", "player", "frames")

    parser = argparse.ArgumentParser(description="Slice spritesheet using TexturePacker JSON.")
    parser.add_argument("--json", dest="json_path", default=default_json, help="Path to spritesheet JSON")
    parser.add_argument("--image", dest="image_path", default=default_image, help="Path to spritesheet image")
    parser.add_argument("--out", dest="out_dir", default=default_out, help="Output directory for frames")
    args = parser.parse_args()

    data = load_json(args.json_path)
    ensure_dir(args.out_dir)

    atlas = Image.open(args.image_path).convert("RGBA")
    slice_frames(atlas, data, args.out_dir)

    print(f"Done. Frames saved to: {args.out_dir}")


if __name__ == "__main__":
    main()
