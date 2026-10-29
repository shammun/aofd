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

REFS_RWM_V2 = {  # ch00_reading_weather_maps v2 (#69) library batch, verified 2026-10-29 (see SOURCES.md)
    "roc_wsr88d_beam_height_m": {
        "ke": 1.21, "a_m": 6.371e6, "range_km": [1, 10, 30, 60],
        "rows": {"0.48": [8.5, 90.9, 311.5, 739.7], "0.88": [15.4, 159.9, 518.5, 1153.8],
                 "1.27": [22.3, 228.9, 725.6, 1567.9], "1.76": [30.7, 313.2, 978.6, 2074.0],
                 "2.37": [41.5, 420.5, 1300.5, 2717.8], "3.08": [53.7, 543.1, 1668.3, 3453.3],
                 "4.00": [69.8, 703.9, 2150.5, 4417.8], "5.10": [88.9, 895.0, 2724.0, 5564.8],
                 "6.73": [117.3, 1178.8, 3575.2, 7267.1], "8.00": [139.2, 1397.9, 4232.5, 8581.8],
                 "9.98": [173.3, 1738.8, 5255.2, 10627.2]},
        "source": "NWS ROC WSR-88D Beam Height Tables (weather.gov/media/roc/windfarm/)"},
    "marshall_palmer_dsd": {"N0_m3_mm": 8000.0, "Lambda_coeff_mm": 4.1, "Lambda_exp": -0.21,
                            "source": "Marshall & Palmer 1948, J. Meteor. 5, 165-166"},
    "geostationary_radius_km": {"value": 42164.172, "with_oblateness": 42164.697, "altitude_km": 35786.0,
                                "speed_km_s": 3.075, "source": "Nelson 2001, Via Satellite"},
    "aqua_orbit": {"altitude_km": 705.0, "period_min": 98.8, "source": "NASA Aqua mission page"},
    "wgs84": {"GM_m3_s2": 3.986004418e14, "a_m": 6378137.0, "omega_rad_s": 7.292115e-5,
              "source": "NIMA TR8350.2 (2000); IERS Conventions 2010"},
}

if __name__ == "__main__":
    out = Path(__file__).with_name("benchmarks_poc.json")
    out.write_text(json.dumps(REFS, indent=2), encoding="utf-8")
    print("wrote", out)
    out2 = Path(__file__).with_name("benchmarks_derivatives.json")
    out2.write_text(json.dumps(REFS_DERIVATIVES, indent=2), encoding="utf-8")
    print("wrote", out2)
    out3 = Path(__file__).with_name("benchmarks_rwm_v2.json")
    out3.write_text(json.dumps(REFS_RWM_V2, indent=2), encoding="utf-8")
    print("wrote", out3)
