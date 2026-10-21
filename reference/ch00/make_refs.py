"""Write the PoC benchmark values (cited in SOURCES.md) to reference/ch00/benchmarks_poc.json."""
import json
from pathlib import Path

REFS = {
    "omega_wgs84_rad_s": {"value": 7292115e-11, "source": "NGA WGS 84 TR8350.2"},
    "inertial_period_45deg_h": {"value": 16.9, "precision": 0.1, "source": "cleonis.nl table; Charles Univ. ex. 10"},
    "ussa1976_scale_height_0km_m": {"value": 8435.0, "precision": 1.0, "source": "USSA-1976 via pdas.com Table 2"},
    "ussa1976_scale_height_20km_m": {"value": 6382.0, "precision": 1.0, "source": "USSA-1976 via pdas.com Table 2"},
    "ussa1976_5km_T_K": {"value": 255.676, "source": "USSA-1976 via pdas.com Table 1"},
    "ussa1976_5km_p_Pa": {"value": 54048.0, "precision": 1.0, "source": "USSA-1976 via pdas.com Table 1"},
}

if __name__ == "__main__":
    out = Path(__file__).with_name("benchmarks_poc.json")
    out.write_text(json.dumps(REFS, indent=2), encoding="utf-8")
    print("wrote", out)
