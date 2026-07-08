# GOALCURRENT.LIVE — Social Assets

Generated Instagram content for WC26 QF: Morocco vs France.

## Regenerate

```bash
python3 scripts/social/generate_qf_morfra.py
```

Requires: `Pillow`, `cairosvg`, `ffmpeg`.

## Outputs

| Asset | Path | Size |
|-------|------|------|
| Story | `stories/Story_QF_MorFra.png` | 1080×1920 |
| Feed | `posts/Feed_QF_MorFra.png` | 1080×1080 |
| Reel | `reels/Reel_QF_MorFra.mp4` | 1080×1920, 20s, 30fps |
| Storyboard frames | `reels/Reel_QF_MorFra_Storyboard/` | 5 beats |
| Captions | `captions/QF_MorFra_captions.txt` | Copy-paste ready |

## Notes

- Team badges use circular flag treatments (site uses `flagcdn.com`; no crest files in repo).
- Story poll sticker is a visual mock — replace with native IG poll sticker at publish time.
- Reel beat 2 includes `[Fan clip]` placeholders for video overlays in CapCut/Premiere.
