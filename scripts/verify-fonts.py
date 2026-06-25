#!/usr/bin/env python3
"""
Verify variable font axes in self-hosted woff2 files.
Run: python3 scripts/verify-fonts.py
Output is recorded in /docs/state-baseline.md under "Font axis verification".
"""
import sys
from pathlib import Path

try:
    from fontTools.ttLib import TTFont
except ImportError:
    print("ERROR: fonttools not installed. Run: pip install fonttools brotli")
    sys.exit(1)

FONTS = [
    Path("public/fonts/Fraunces-Variable.woff2"),
    Path("public/fonts/PublicSans-Variable.woff2"),
]

for path in FONTS:
    if not path.exists():
        print(f"MISSING: {path}")
        continue
    font = TTFont(path)
    print(f"\n{path.name}:")
    if "fvar" in font:
        for axis in font["fvar"].axes:
            name = font["name"].getDebugName(axis.axisNameID)
            print(f"  tag={axis.axisTag!r:8}  min={axis.minValue:7}  default={axis.defaultValue:7}  max={axis.maxValue:7}  name={name!r}")
    else:
        print("  NO fvar table — not a variable font")
