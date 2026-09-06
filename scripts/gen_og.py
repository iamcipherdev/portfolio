#!/usr/bin/env python3
"""Generate a premium OG share image (1200x630) for the portfolio."""
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
CREAM = (245, 243, 238)
INK = (17, 17, 17)
MUTED = (119, 119, 119)
BLUE = (77, 107, 255)
LINE = (17, 17, 17, 20)

img = Image.new("RGB", (W, H), CREAM)
d = ImageDraw.Draw(img)

# dot grid
for x in range(40, W, 44):
    for y in range(40, H, 44):
        d.ellipse([x - 1, y - 1, x + 1, y + 1], fill=(17, 17, 17, 6))

# hairline frame
d.rectangle([28, 28, W - 28, H - 28], outline=(210, 206, 196), width=2)

def font(path, size):
    return ImageFont.truetype(path, size)

bold = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
mono = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"

# eyebrow
d.text((90, 96), "AI × WEB DEVELOPER", font=font(mono, 22), fill=MUTED)
d.rectangle([90, 72, 102, 84], fill=BLUE)

# headline
d.text((86, 180), "I build useful", font=font(bold, 96), fill=INK)
d.text((86, 292), "digital products", font=font(bold, 96), fill=INK)
d.text((86, 404), "with AI & the web.", font=font(bold, 96), fill=(150, 150, 150))

# name plate bottom
d.text((90, H - 92), "LUNAR", font=font(bold, 34), fill=INK)
d.rectangle([232, H - 78, 244, H - 66], fill=BLUE)
d.text((268, H - 88), "BASED IN PAKISTAN · BUILDING IN 2026", font=font(mono, 18), fill=MUTED)

img.save("/home/z/my-project/public/og.png", "PNG", optimize=True)
print("OG image saved")
