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

REFS_DERIVATIVES = {  # ch00_derivatives_taylor (#4) library batch, verified 2026-10-28 (see SOURCES.md)
    "stefan_boltzmann_W_m2_K4": {"value": 5.670374419e-8, "exact": True, "source": "CODATA 2022 (NIST CUU)"},
    "santer_ne_formula": {"value": "n_e = n (1 - r1)/(1 + r1); r1 of residuals; n_e - 2 replaces n - 2",
                          "source": "Santer et al. 2008 IJoC 28, Eqs. (4)-(6)"},
    "latent_heat_T_coeffs": {"value": [2.501e6, -2370.0], "unit": "J/kg, J/kg/degC", "source": "Stull 1988 (bigleaf docs)"},
    "c3s_gmst_2023_11_degC": {"value": 14.22, "source": "C3S monthly bulletin Nov 2023 (ERA5)"},
}

if __name__ == "__main__":
    out = Path(__file__).with_name("benchmarks_poc.json")
    out.write_text(json.dumps(REFS, indent=2), encoding="utf-8")
    print("wrote", out)
    out2 = Path(__file__).with_name("benchmarks_derivatives.json")
    out2.write_text(json.dumps(REFS_DERIVATIVES, indent=2), encoding="utf-8")
    print("wrote", out2)
