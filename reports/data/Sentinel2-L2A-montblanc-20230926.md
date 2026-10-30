# Sentinel2-L2A-montblanc-20230926: Sentinel-2 true colour, Mont Blanc (movie #6 D2, recommended)

- **Route**: map-toolkit STAC adapter, `.venv-maps`, Earth Search, asset `visual`, range reads, 149.7 s. It does not pass through `fetch`, so I ran `tools/disk_guard.py --need 400MB` first. No browser process.
- **Date**: 26 Sep 2023, 10:38 UTC, the clearest pass over the whole box (cloud < 0.01 %). Snow is limited to the high massif.
- **Licence**: Copernicus Sentinel data legal notice, free, full and open. Notice "Contains modified Copernicus Sentinel data 2023". **Redistributable: yes.**
- **Product**: `s2_montblanc_2023-09-26.jpg` (4096 × 3413, 6,148,166 B) + `.json`, G: only because `data/derived` is at 147.0 of 150 MB. Bounds W 6.6, S 45.6, E 7.2, N 46.1; row 0 = north. No-data 0.009 %.
- **Pitfall**: the late-September sun is low, so north-facing slopes are dark. An August scene (22 Aug 2023) has less shadow but more cloud (1.9 %).
- **Colab route**: a smaller JPEG if the budget allows, or re-render with no keys.
- **Disk**: whole session, C: 60.4 → 61.0 GB free, G: 492.1 → 491.1 GB free, project data 98.07 → 99.01 GB. Render scratch moves these too. Nothing evicted.
