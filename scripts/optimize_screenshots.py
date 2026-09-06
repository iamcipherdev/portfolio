#!/usr/bin/env python3
"""Optimize project screenshots: resize + convert to WebP for the portfolio."""
from PIL import Image
import os

SRC = "/home/z/my-project/public/projects"
projects = ["recuroo", "latenightcorner", "campuslift", "letter", "meeranpak"]

for name in projects:
    top_path = os.path.join(SRC, f"{name}-top.png")
    img = Image.open(top_path).convert("RGB")
    w, h = img.size

    # Desktop version: 1280px wide WebP
    desktop = img.resize((1280, int(h * 1280 / w)), Image.LANCZOS)
    desktop.save(os.path.join(SRC, f"{name}-lg.webp"), "WEBP", quality=82, method=6)

    # Mobile version: 720px wide WebP
    mobile = img.resize((720, int(h * 720 / w)), Image.LANCZOS)
    mobile.save(os.path.join(SRC, f"{name}-sm.webp"), "WEBP", quality=78, method=6)
    print(f"{name}: {w}x{h} -> lg {desktop.size}, sm {mobile.size}")

print("Done")
