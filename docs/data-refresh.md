# Postcode Data Refresh — Annual Process

The diagnostic tool's postcode lookup is a pre-computed static JSON file. It does not call any external API at runtime. This means the data must be refreshed manually, once a year, by following this process.

**File to update:** `src/data/uk_postcode_profile.json`

**Target refresh cadence:** Every January, covering the previous calendar year's data.

**Visible to users:** The "last updated" date shown in the tool footer on `/tool/result` is a hardcoded string in `result.astro`. Update it alongside the data file.

---

## What the data covers

Each postcode entry records five things:

| Field | What it represents | How to update |
|---|---|---|
| `water_hardness_mgl` | Calcium carbonate mg/L at the tap | Pull from DWI reports and water company data |
| `water_band` | Derived from hardness: soft / moderate / hard / very_hard / extreme | Recalculate from updated `water_hardness_mgl` |
| `water_uk_percentile` | Where this hardness sits in the UK distribution | Recalculate after updating all entries |
| `humidity_avg` | Annual mean relative humidity, percent | Pull from Met Office Historic Station Data |
| `humidity_band` | Derived: low (<60) / moderate (60-75) / high (>75) | Recalculate from updated `humidity_avg` |
| `chlorine_level` | Categorical: low / moderate / high | Pull from DWI water quality reports |
| `salon_density` | Proxy for Afro-specialist salon access: high / moderate / low / very_low | Update from Habia regional data or manual survey |

---

## Data sources

### Water hardness

Primary: **Drinking Water Inspectorate (DWI)** annual reports.

- URL: [dwi.gov.uk/drinking-water-quality/annual-statistics](https://www.dwi.gov.uk/drinking-water-quality/annual-statistics/)
- Published annually, usually February/March for the previous year.
- Reports are by water company. Cross-reference company supply zones with postcode areas.

Secondary: individual water company hardness data, which is often more granular.

| Region | Water company | Data location |
|---|---|---|
| London | Thames Water | thameswater.co.uk — search "water hardness" |
| East Anglia, East Midlands | Anglian Water | anglianwater.co.uk/help/water-quality |
| West Midlands | Severn Trent | stwater.co.uk/help/your-water/water-quality |
| Yorkshire | Yorkshire Water | yorkshirewater.com/water-quality |
| NW England | United Utilities | unitedutilities.com/services/water/your-water |
| SW England | South West Water | southwestwater.co.uk/water-quality |
| Wales | Dŵr Cymru (Welsh Water | dwrcymru.com/en/My-Account/Water-Quality |
| Scotland | Scottish Water | scottishwater.co.uk/environment/water-quality |
| Northern Ireland | NI Water | niwater.com/drinking-water-quality |

**Unit conversion note.** Some older reports express hardness in French degrees (°fH) or German degrees (°dH). Convert before entering:
- 1 °fH = 10 mg/L CaCO3
- 1 °dH = 17.85 mg/L CaCO3

**TapWater.uk** has partial aggregation but its data is incomplete and sometimes stale. Use it as a cross-reference only, not as a primary source.

### Humidity

Source: **Met Office Historic Station Data** (free, no API needed).

- URL: [metoffice.gov.uk/research/climate/maps-and-data/historic-station-data](https://www.metoffice.gov.uk/research/climate/maps-and-data/historic-station-data)
- ~270 stations across the UK. Map each postcode area to its nearest station.
- Use annual mean relative humidity. For the tool, the figure that matters is whether humidity is pulling moisture from hair — annual mean is a sufficient proxy.

For postcode areas not near a Met Office station (remote Scotland, islands), use the nearest coastal or regional station and flag the precision as `regional`.

### Chlorine

Source: **DWI Drinking Water Quality reports** (same as hardness).

The tool uses categorical values only (low / moderate / high), not precise measurements. The following regional picture is stable year-to-year:

- **Low:** Scotland, Wales, Northern Ireland, most of SW England — typically 0.1–0.3 mg/L
- **Moderate:** most of England — typically 0.3–0.5 mg/L
- **High:** rare; some water treatment zones during specific remediation periods — typically >0.5 mg/L

Check DWI reports for any significant changes. In most years, chlorine banding does not change.

### Salon density

Source: **Habia** (Hair and Beauty Industry Authority) regional data, combined with manual verification using Google Maps.

- URL: [habia.org](https://www.habia.org) — request regional breakdown of registered Afro/textured hair specialists
- Supplement with a manual search: `"afro hair salon" site:google.com/maps` filtered by postcode area

The `salon_density` field is a proxy for how easily a reader can access professional help if the tool's recommendation doesn't resolve their issue. It feeds the medical exit ramp copy calibration. It is the least data-dependent field — update it only if you have specific evidence of a significant regional change.

---

## Precision levels

Entries carry a `_precision` field:

| Value | Meaning |
|---|---|
| `district` | District-specific verified data (e.g. SE18 differs from SE22) |
| `area` | One value covers all districts in the postcode area (e.g. all SE districts use the same entry) |
| `regional` | Broader regional estimate; used where no station or company data is available |

The current dataset is entirely `area` precision. Upgrading entries to `district` precision is a long-term goal, not a v1 requirement. Prioritise the most-visited areas first: London (all zones), Manchester, Birmingham, Bristol, Leeds.

---

## How to update the file

1. Pull the latest DWI report and water company hardness tables.
2. For each postcode area, note any hardness change greater than 10 mg/L. If no significant change, the entry stands.
3. Pull the Met Office annual mean humidity figures for the nearest station to each area. Update `humidity_avg` where the annual mean has shifted by more than 2 percentage points.
4. Recalculate `water_band` for any entries where `water_hardness_mgl` changed enough to cross a band boundary.
5. Recalculate `water_uk_percentile` values after all hardness updates. The percentile is relative to the UK distribution — if many entries changed, rerun the ranking across the full dataset.
6. Update `chlorine_level` only where DWI data shows a sustained change, not a short-term treatment event.
7. Update `salon_density` where Habia data or your own knowledge indicates a meaningful regional shift.
8. Update `_meta.last_updated` in the JSON file to the current year-month (e.g. `"2027-01"`).
9. Update the visible date in `src/pages/tool/result.astro` — the string `"Postcode data last updated: June 2026"`.
10. Run `pnpm build` and confirm it exits 0.
11. Run the diagnostic tests: `pnpm test` — confirm all pass.

---

## Validation checks to run after each refresh

```bash
# Confirm the JSON is valid
node -e "JSON.parse(require('fs').readFileSync('src/data/uk_postcode_profile.json','utf8')); console.log('JSON valid')"

# Confirm all 121 areas are present
node -e "
const d = JSON.parse(require('fs').readFileSync('src/data/uk_postcode_profile.json','utf8'));
const count = Object.keys(d.districts).length;
console.log('Entries:', count);
"

# Confirm all water_band values are valid
node -e "
const d = JSON.parse(require('fs').readFileSync('src/data/uk_postcode_profile.json','utf8'));
const validBands = new Set(['soft','moderate','hard','very_hard','extreme']);
const invalid = Object.entries(d.districts).filter(([k,v]) => !validBands.has(v.water_band));
if (invalid.length) { console.error('Invalid water_band entries:', invalid.map(([k])=>k)); process.exit(1); }
console.log('All water_band values valid');
"

# Confirm percentiles are 0-100
node -e "
const d = JSON.parse(require('fs').readFileSync('src/data/uk_postcode_profile.json','utf8'));
const bad = Object.entries(d.districts).filter(([k,v]) => v.water_uk_percentile < 0 || v.water_uk_percentile > 100);
if (bad.length) { console.error('Bad percentiles:', bad.map(([k])=>k)); process.exit(1); }
console.log('All percentiles valid');
"
```

---

## Adding district-level precision over time

The area-level entries mean a reader entering `SE18` and one entering `SE4` get the same water data. For London, this is meaningfully inaccurate — Thames Water supplies the whole area at roughly similar hardness, but some boroughs show variation.

To add a district-level entry, add a new key alongside the area entry:

```json
"SE18": {
  "district": "SE18",
  "water_hardness_mgl": 285,
  "water_band": "very_hard",
  ...
  "_precision": "district"
}
```

The lookup function checks for an exact district match first, then falls back to the area entry. So adding `SE18` while `SE` still exists is safe — `SE18` users get the precise entry, all other SE districts get the area entry.

Prioritise district-level data for postcode areas where hardness varies significantly within the area (e.g. parts of Yorkshire where Pennine reservoir water meets borehole water at district boundaries).

---

## What NOT to change

- The `_schema` and `_fallback` keys — these are read by the resolver and the UI. Only change these if you're intentionally changing the data model.
- The `_precision` field for entries you haven't verified — leave them at `area` until you have district-specific data.
- The `salon_density` field without evidence — it affects the medical exit ramp. Conservative estimates are safer than optimistic ones.
