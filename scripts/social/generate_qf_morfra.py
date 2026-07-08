#!/usr/bin/env python3
"""Generate Instagram Story, Feed, and Reel assets for WC26 QF Morocco vs France."""

import math
import os
import subprocess
from pathlib import Path

import cairosvg
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
ASSETS = ROOT / "assets" / "social"
FONTS = ASSETS / "fonts"
SOURCE = ASSETS / "source"
STORIES = ASSETS / "stories"
POSTS = ASSETS / "posts"
REELS = ASSETS / "reels"

MOROCCO_RED = (0xC1, 0x27, 0x2D)
FRANCE_NAVY = (0x00, 0x26, 0x54)
GOLD = (0xFF, 0xD7, 0x00)
WHITE = (0xFF, 0xFF, 0xFF)
CHARCOAL = (0x11, 0x11, 0x11)
GREY = (0xCC, 0xCC, 0xCC)
BLACK = (0x00, 0x00, 0x00)


def load_font(name: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONTS / name), size)


def hex_rgb(h: str) -> tuple[int, int, int]:
    h = h.lstrip("#")
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))


def draw_diagonal_split(img: Image.Image, left_color, right_color, seam_color=GOLD, seam_width=8):
    w, h = img.size
    draw = ImageDraw.Draw(img)
    for y in range(h):
        x_split = int((y / h) * w)
        draw.line([(0, y), (x_split, y)], fill=left_color)
        draw.line([(x_split, y), (w, y)], fill=right_color)
    seam = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    sd = ImageDraw.Draw(seam)
    for y in range(h):
        x_split = int((y / h) * w)
        sd.line([(x_split - seam_width // 2, y), (x_split + seam_width // 2, y)], fill=(*seam_color, 255))
    img.paste(seam, (0, 0), seam)


def circular_crest(flag_path: Path, size: int, glow_color=None) -> Image.Image:
    flag = Image.open(flag_path).convert("RGBA")
    flag = flag.resize((size, size), Image.Resampling.LANCZOS)

    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size - 1, size - 1), fill=255)

    canvas_size = size + 40
    canvas = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    if glow_color:
        glow = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
        gd = ImageDraw.Draw(glow)
        gd.ellipse((10, 10, canvas_size - 11, canvas_size - 11), fill=(*glow_color, 80))
        glow = glow.filter(ImageFilter.GaussianBlur(12))
        canvas = Image.alpha_composite(canvas, glow)

    ring = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    rd = ImageDraw.Draw(ring)
    rd.ellipse((8, 8, canvas_size - 9, canvas_size - 9), outline=(*GOLD, 255), width=4)
    canvas = Image.alpha_composite(canvas, ring)

    crest = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    crest.paste(flag, (0, 0), mask)
    canvas.paste(crest, (20, 20), crest)
    return canvas


def draw_centered_in_region(draw, text, region_x, region_w, y, font, fill):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    x = region_x + (region_w - tw) // 2
    draw.text((x, y), text, font=font, fill=fill)


def draw_centered_text(draw, text, y, font, fill, width, spacing=0):
    if spacing:
        total_w = sum(draw.textbbox((0, 0), c, font=font)[2] for c in text) + spacing * (len(text) - 1)
    else:
        bbox = draw.textbbox((0, 0), text, font=font)
        total_w = bbox[2] - bbox[0]
    x = (width - total_w) // 2
    if spacing:
        for c in text:
            draw.text((x, y), c, font=font, fill=fill)
            x += draw.textbbox((0, 0), c, font=font)[2] + spacing
    else:
        draw.text((x, y), text, font=font, fill=fill)


def draw_pill_badge(draw, text, cx, cy, font, bg=GOLD, fg=FRANCE_NAVY, pad_x=36, pad_y=12):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    rx0, ry0 = cx - tw // 2 - pad_x, cy - pad_y
    rx1, ry1 = cx + tw // 2 + pad_x, cy + th + pad_y
    draw.rounded_rectangle((rx0, ry0, rx1, ry1), radius=28, fill=bg)
    draw.text((cx - tw // 2, cy), text, font=font, fill=fg)


def draw_poll_sticker(draw, cx, cy, width=700, height=280):
    x0, y0 = cx - width // 2, cy - height // 2
    x1, y1 = cx + width // 2, cy + height // 2
    draw.rounded_rectangle((x0, y0, x1, y1), radius=24, fill=(255, 255, 255, 240), outline=(200, 200, 200), width=2)
    qfont = load_font("Inter-Bold.ttf", 28)
    obfont = load_font("Inter-Bold.ttf", 24)
    draw.text((x0 + 28, y0 + 24), "Who's through?", font=qfont, fill=BLACK)
    opt_h = 56
    for i, (label, color) in enumerate([("🇲🇦  Morocco", MOROCCO_RED), ("🇫🇷  France", FRANCE_NAVY)]):
        oy = y0 + 80 + i * (opt_h + 12)
        draw.rounded_rectangle((x0 + 20, oy, x1 - 20, oy + opt_h), radius=14, fill=(245, 245, 245))
        draw.text((x0 + 36, oy + 14), label, font=obfont, fill=color)
        draw.ellipse((x1 - 56, oy + 16, x1 - 28, oy + 44), outline=(180, 180, 180), width=2)


def floodlight_texture(width: int, height: int | None = None) -> Image.Image:
    height = height or width
    tex = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(tex)
    for i in range(6):
        angle = i * 60
        cx = width // 2 + int(math.cos(math.radians(angle)) * width * 0.35)
        cy = height // 2 + int(math.sin(math.radians(angle)) * height * 0.35)
        for r in range(200, 0, -8):
            alpha = int(18 * (1 - r / 200))
            draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(255, 255, 255, alpha))
    return tex


def draw_lightning_vs(draw, cx, cy, size=80):
    points = [
        (cx, cy - size),
        (cx - size * 0.35, cy - size * 0.05),
        (cx - size * 0.1, cy - size * 0.05),
        (cx - size * 0.45, cy + size),
        (cx + size * 0.15, cy + size * 0.1),
        (cx - size * 0.05, cy + size * 0.1),
        (cx + size * 0.35, cy - size),
    ]
    draw.polygon(points, fill=GOLD)


def generate_story():
    w, h = 1080, 1920
    img = Image.new("RGB", (w, h))
    draw_diagonal_split(img, MOROCCO_RED, FRANCE_NAVY)
    draw = ImageDraw.Draw(img)

    logo_font = load_font("BebasNeue-Regular.ttf", 48)
    draw_centered_text(draw, "GOALCURRENT.LIVE", 160, logo_font, WHITE, w, spacing=4)

    badge_font = load_font("Inter-Bold.ttf", 32)
    draw_pill_badge(draw, "QUARTERFINAL", w // 2, 380, badge_font)

    morocco = circular_crest(SOURCE / "morocco-flag.png", 260)
    france = circular_crest(SOURCE / "france-flag.png", 260)
    img.paste(morocco, (120, 580), morocco)
    img.paste(france, (w - 120 - morocco.width, 580), france)

    vs_font = load_font("BebasNeue-Regular.ttf", 90)
    draw_centered_text(draw, "VS", 700, vs_font, GOLD, w)

    body_font = load_font("Inter-Regular.ttf", 28)
    draw_centered_text(draw, "GILLETTE STADIUM, BOSTON", 980, body_font, WHITE, w)

    time_font = load_font("Inter-Bold.ttf", 36)
    draw_centered_text(draw, "4:00 PM ET · THU JULY 9", 1120, time_font, WHITE, w)

    draw_poll_sticker(draw, w // 2, 1500)

    tap_font = load_font("Inter-Regular.ttf", 24)
    draw_centered_text(draw, "Tap to vote 👇", 1780, tap_font, WHITE, w)

    link_font = load_font("Inter-Bold.ttf", 22)
    draw_pill_badge(draw, "Live updates →", w // 2, h - 90, link_font, bg=GOLD, fg=FRANCE_NAVY, pad_x=28, pad_y=10)

    out = STORIES / "Story_QF_MorFra.png"
    img.save(out, "PNG", optimize=True)
    print(f"Saved {out}")
    return out


def generate_feed():
    w, h = 1080, 1080
    img = Image.new("RGB", (w, h), CHARCOAL)
    tex = floodlight_texture(w, h)
    img = Image.alpha_composite(img.convert("RGBA"), tex).convert("RGB")
    draw = ImageDraw.Draw(img)

    badge_font = load_font("Inter-Bold.ttf", 36)
    draw_pill_badge(draw, "QUARTERFINAL FINAL 8", w // 2, 100, badge_font)

    morocco = circular_crest(SOURCE / "morocco-flag.png", 300, glow_color=MOROCCO_RED)
    france = circular_crest(SOURCE / "france-flag.png", 300, glow_color=FRANCE_NAVY)
    img.paste(morocco, (80, 300), morocco)
    img.paste(france, (w - 80 - france.width, 300), france)
    draw_lightning_vs(draw, w // 2, 500, size=70)

    headline = load_font("BebasNeue-Regular.ttf", 60)
    draw_centered_text(draw, "MOROCCO vs FRANCE", 820, headline, WHITE, w)

    sub_font = load_font("Inter-Regular.ttf", 30)
    draw_centered_text(draw, "Gillette Stadium, Boston · Thu 9 July · 4PM ET", 920, sub_font, GREY, w)

    cta_font = load_font("Inter-Regular.ttf", 24)
    cta = "Follow @goalcurrent.live for live reactions"
    bbox = draw.textbbox((0, 0), cta, font=cta_font)
    tw = bbox[2] - bbox[0]
    cx = (w - tw) // 2
    draw.text((cx, 1020), cta, font=cta_font, fill=WHITE)
    draw.line((cx, 1050, cx + tw, 1050), fill=GOLD, width=3)

    out = POSTS / "Feed_QF_MorFra.png"
    img.save(out, "PNG", optimize=True)
    print(f"Saved {out}")
    return out


def beat1_hook() -> Image.Image:
    w, h = 1080, 1920
    img = Image.new("RGB", (w, h))
    draw_diagonal_split(img, MOROCCO_RED, FRANCE_NAVY)
    draw = ImageDraw.Draw(img)
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 100))
    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    draw = ImageDraw.Draw(img)
    font = load_font("BebasNeue-Regular.ttf", 80)
    draw_centered_text(draw, "THE FINAL 8", 780, font, WHITE, w)
    draw_centered_text(draw, "CONTINUES", 900, font, GOLD, w)
    return img


def beat2_split() -> Image.Image:
    w, h = 1080, 1920
    img = Image.new("RGB", (w, h), CHARCOAL)
    draw = ImageDraw.Draw(img)
    draw.rectangle((0, 0, w // 2, h), fill=MOROCCO_RED)
    draw.rectangle((w // 2, 0, w, h), fill=FRANCE_NAVY)
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 80))
    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    draw = ImageDraw.Draw(img)

    morocco = circular_crest(SOURCE / "morocco-flag.png", 200)
    france = circular_crest(SOURCE / "france-flag.png", 200)
    img.paste(morocco, (w // 4 - morocco.width // 2, 700), morocco)
    img.paste(france, (3 * w // 4 - france.width // 2, 700), france)

    team_font = load_font("BebasNeue-Regular.ttf", 40)
    draw_centered_in_region(draw, "ATLAS LIONS", 0, w // 2, 980, team_font, WHITE)
    draw_centered_in_region(draw, "LES BLEUS", w // 2, w // 2, 980, team_font, WHITE)

    draw.text((w // 2 - 60, 650), "VS", font=load_font("BebasNeue-Regular.ttf", 60), fill=GOLD)
    draw.text((w // 4 - 120, 400), "[Fan clip]", font=load_font("Inter-Regular.ttf", 28), fill=GREY)
    draw.text((3 * w // 4 - 120, 400), "[Fan clip]", font=load_font("Inter-Regular.ttf", 28), fill=GREY)
    return img


def beat3_stakes() -> Image.Image:
    w, h = 1080, 1920
    img = Image.new("RGB", (w, h), BLACK)
    draw = ImageDraw.Draw(img)
    font = load_font("BebasNeue-Regular.ttf", 50)
    lines = ["WINNER FACES", "ENGLAND OR NORWAY", "IN THE SEMIS"]
    y = 780
    for line in lines:
        draw_centered_text(draw, line, y, font, WHITE, w)
        y += 70
    bbox = draw.textbbox((0, 0), lines[1], font=font)
    tw = bbox[2] - bbox[0]
    draw.line(((w - tw) // 2, y - 10, (w + tw) // 2, y - 10), fill=GOLD, width=4)
    return img


def beat4_match_info() -> Image.Image:
    w, h = 1080, 1920
    img = Image.new("RGB", (w, h), CHARCOAL)
    tex = floodlight_texture(w, h)
    img = Image.alpha_composite(img.convert("RGBA"), tex).convert("RGB")

    morocco = circular_crest(SOURCE / "morocco-flag.png", 280, glow_color=MOROCCO_RED)
    france = circular_crest(SOURCE / "france-flag.png", 280, glow_color=FRANCE_NAVY)
    img.paste(morocco, (120, 650), morocco)
    img.paste(france, (w - 120 - france.width, 650), france)
    draw = ImageDraw.Draw(img)
    draw_lightning_vs(draw, w // 2, 820, size=60)

    info_font = load_font("Inter-Bold.ttf", 36)
    draw_centered_text(draw, "THU JULY 9 · 4PM ET", 1100, info_font, WHITE, w)
    draw_centered_text(draw, "GILLETTE STADIUM", 1160, info_font, GOLD, w)
    return img


def beat5_cta() -> Image.Image:
    w, h = 1080, 1920
    img = Image.new("RGB", (w, h), GOLD)
    draw = ImageDraw.Draw(img)
    font = load_font("BebasNeue-Regular.ttf", 60)
    draw_centered_text(draw, "Drop your score", 780, font, FRANCE_NAVY, w)
    draw_centered_text(draw, "prediction 🔥", 870, font, FRANCE_NAVY, w)
    logo_font = load_font("BebasNeue-Regular.ttf", 32)
    draw_centered_text(draw, "GOALCURRENT.LIVE", h - 120, logo_font, FRANCE_NAVY, w)
    return img


def generate_reel():
    beats = [
        ("beat1_hook", beat1_hook, 3),
        ("beat2_split", beat2_split, 4),
        ("beat3_stakes", beat3_stakes, 4),
        ("beat4_match_info", beat4_match_info, 4),
        ("beat5_cta", beat5_cta, 5),
    ]

    storyboard_dir = REELS / "Reel_QF_MorFra_Storyboard"
    storyboard_dir.mkdir(parents=True, exist_ok=True)

    concat_lines = []
    for name, fn, duration in beats:
        frame = fn()
        frame_path = storyboard_dir / f"{name}.png"
        frame.save(frame_path, "PNG")
        print(f"Saved {frame_path}")

        clip_path = REELS / f"{name}.mp4"
        subprocess.run(
            [
                "ffmpeg", "-y", "-loop", "1", "-i", str(frame_path),
                "-c:v", "libx264", "-t", str(duration),
                "-pix_fmt", "yuv420p", "-vf", "scale=1080:1920",
                "-r", "30", str(clip_path),
            ],
            check=True,
            capture_output=True,
        )
        concat_lines.append(f"file '{clip_path}'")

    concat_file = REELS / "concat.txt"
    concat_file.write_text("\n".join(concat_lines) + "\n")

    out = REELS / "Reel_QF_MorFra.mp4"
    subprocess.run(
        [
            "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(concat_file),
            "-c", "copy", str(out),
        ],
        check=True,
        capture_output=True,
    )
    for clip_path in REELS.glob("beat*.mp4"):
        clip_path.unlink()
    concat_file.unlink(missing_ok=True)
    print(f"Saved {out}")
    return out


def write_captions():
  captions = ASSETS / "captions" / "QF_MorFra_captions.txt"
  captions.parent.mkdir(parents=True, exist_ok=True)
  captions.write_text(
    """INSTAGRAM FEED CAPTION
Dreams vs. Legacy. 🇲🇦🇫🇷 One spot in the semis, one shot at history. Who ya got — drop your score prediction below 👇 #WorldCup2026 #MoroccoFrance #QuarterFinal

INSTAGRAM REEL CAPTION
Quarterfinal time. 🇲🇦 vs 🇫🇷 — winner's one game from the final four. Score prediction in the comments 👇 #WorldCup2026 #MoroccoFrance
"""
  )
  print(f"Saved {captions}")


def main():
    for d in (STORIES, POSTS, REELS):
        d.mkdir(parents=True, exist_ok=True)
    generate_story()
    generate_feed()
    generate_reel()
    write_captions()
    print("All assets generated.")


if __name__ == "__main__":
    main()
