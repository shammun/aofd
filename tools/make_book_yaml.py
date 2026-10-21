"""Generate book.yaml from the Vallis PDF's own bookmark outline plus the decisions in PLANNING.md (§3, §9.1, §15).

The outline gives exact PDF pages for every chapter and numbered section (pdf = printed + 20), so no page is guessed.
The project/policy blocks, slugs, explainer and movie seeds, the three-part Chapter 0 and the data root are taken
from PLANNING.md (§3 table, §9.1, §15.3 Q11/Q12, §15.4) and written here once. Seeds are priors for the curator, not
decisions.

Usage (from the repo root)::

    .venv/Scripts/python.exe tools/make_book_yaml.py            # writes book.yaml (refuses to overwrite)
    .venv/Scripts/python.exe tools/make_book_yaml.py --force    # regenerate (annotations added by hand are lost)
    .venv/Scripts/python.exe tools/make_book_yaml.py --print    # print to stdout only

Run tools/detect_chapters.py afterwards: it compares book.yaml with the outline and must exit 0.
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
OFFSET = 20                     # pdf_page = printed_page + 20 (PDF 21 is printed page 1)

SLUGS = {1: "equations_of_motion", 2: "rotation_stratification", 3: "shallow_water", 4: "vorticity_pv",
         5: "geostrophic_theory", 6: "wave_fundamentals", 7: "gravity_waves", 8: "low_latitudes", 9: "instability",
         10: "wave_mean_flow", 11: "turbulence_basics", 12: "geostrophic_turbulence", 13: "eddy_transport",
         14: "hadley_ferrel", 15: "midlatitude_circulation", 16: "planetary_waves", 17: "stratosphere",
         18: "moist_tropics", 19: "wind_driven_gyres", 20: "upper_ocean", 21: "moc_acc", 22: "equatorial_enso"}

# PLANNING §3 "Explainer seeds" and "Movie seeds" ([3D] = a three.js view expected to help, [data] = reproduced data
# figure, [K …] = re-skin/extend a Kundu explainer).
VIZ_SEEDS = {
    1: ["material vs local derivative on a weather balloon [K ch03]", "mass budget box -> continuity [3D cube]",
        "seawater density in T-S space (gsw)", "potential temperature and theta-surfaces [3D]",
        "sound waves and the incompressible limit", "energy budget term bars",
        "scaling machine (Ro, Fr, aspect ratio)"],
    2: ["Coriolis on a spinning globe, inertial vs Earth frame [3D, K ch04 rotating_frame_coriolis]",
        "effective gravity and the oblate Earth [3D]", "spherical unit vectors and metric terms [3D]",
        "f- and beta-plane tangent plane [3D]", "Boussinesq vs anelastic switch", "pressure as vertical coordinate [3D slab]",
        "geostrophic balance [K ch13]", "thermal wind with sloping isotherms [3D, K ch13]",
        "gradient wind cyclone/anticyclone", "parcel method and N^2 [K ch01]"],
    3: ["SW layer and reduced gravity [3D layers]", "multi-layer stack", "geostrophic adjustment with/without rotation [K ch13]",
        "Poincare/Kelvin waves [3D surface]", "Margules front", "isentropic coordinates", "APE as flattening isentropes [3D]"],
    4: ["circulation and Kelvin's theorem [K ch05]", "stretching and tilting [3D]", "baroclinic generation (solenoids) [3D]",
        "Ertel PV as spin x stratification [3D sheets]", "SW PV column", "PV impermeability"],
    5: ["scale-analysis bars -> QG", "planetary-geostrophic vs QG regimes", "PV inversion (psi from q) [3D]", "two-layer QG",
        "Ekman spiral and pumping [3D, K ch13 ekman_spiral]", "QG energetics"],
    6: ["phase vs group velocity [K ch07]", "ray tracing", "Rossby mechanism (beta, one column) [3D beta-plane]",
        "Rossby dispersion and reflection [K ch13 rossby_waves]", "vertical structure of stratified Rossby waves [3D]"],
    7: ["internal wave cones and St Andrew's cross [3D, K ch07]", "reflection off slopes", "WKB wave guide [data: WOA23 N(z)]",
        "inertia-gravity waves", "lee waves over a ridge [3D]", "acoustic-gravity"],
    8: ["equatorial waves (Kelvin, Yanai, ER, IG) on the beta-plane [3D]", "dispersion diagram reader",
        "equatorial trapping rays", "Matsuno-Gill response [3D]"],
    9: ["Kelvin-Helmholtz", "Rayleigh-Kuo/Fjortoft", "shear-layer roll-up (pseudo-spectral)",
        "Eady growth and mode structure [3D, K ch13]", "two-layer Phillips", "kinematic view (wedge of instability) [3D]",
        "Charney eigenproblem", "rotating annulus regimes [3D tank]"],
    10: ["EP flux arrows", "TEM vs Eulerian streamfunction", "non-acceleration", "Eady eddy-induced mean flow"],
    11: ["Kolmogorov cascade", "2-D dual cascade (pseudo-spectral)", "Lorenz predictability [3D, K ch11]", "tracer spectra"],
    12: ["beta-plane turbulence -> zonal jets", "Rhines scale", "two-layer baroclinic turbulence lifecycle",
         "deformation-radius map [data]"],
    13: ["random walk -> diffusivity", "drifter dispersion [data]", "mixing length", "homogenization",
         "skew vs diffusive flux", "GM eddy-induced circulation [3D isopycnals]"],
    14: ["angular-momentum ring [3D]", "Held-Hou model", "asymmetric Hadley cell", "eddy-driven Ferrel cell",
         "observed overturning [data, 3D globe wedge]"],
    15: ["stirred barotropic jet", "layered models", "EP flux and residual circulation in data [data]", "tropopause height"],
    16: ["Rossby rays on the sphere [3D globe]", "critical lines", "Charney-Drazin vertical propagation",
         "Charney-Eliassen stationary waves [data: ETOPO 45N]", "thermal forcing response"],
    17: ["Brewer-Dobson residual circulation [3D]", "downward control", "QBO 1-D model and data [data]",
         "polar-vortex split (PV isosurfaces) [3D, data]", "SSW composite with EP arrows [3D, data]"],
    18: ["Clausius-Clapeyron", "advection-condensation RH", "moist adiabat and CAPE", "radiative-convective equilibrium",
         "Wheeler-Kiladis spectrum reader [data]", "MJO composite [data]"],
    19: ["Sverdrup interior", "Stommel/Munk western intensification [3D basin + tracers]",
         "observed-wind North Atlantic gyre [data]", "inertial (Fofonoff) gyres", "topographic steering (f/h) [3D]"],
    20: ["Ekman pumping into the thermocline [3D]", "PV on isopycnals [data, 3D layer stack]", "thermocline scaling",
         "ventilated thermocline layers and shadow zone [3D]"],
    21: ["sideways convection", "Stommel two-box with flow-direction glyphs (cf. Fig. 21.6) [3D tanks + dot/cross glyphs]",
         "Stommel-Arons abyss [3D sector]",
         "Southern-Ocean residual overturning, where water comes from/goes to (cf. Fig. 21.30) [3D streamtubes]",
         "ACC and fronts map [data]", "global MOC residual vs Eulerian [data]"],
    22: ["equatorial undercurrent", "Walker circulation", "thermocline tilt and Bjerknes feedback [3D slab, data]",
         "Kelvin/Rossby wave response to wind bursts [3D]", "delayed and recharge oscillators", "ENSO data [data]"],
}
MOVIE_SEEDS = {
    1: ["what the fluid equations say, term by term"], 2: ["Coriolis: straight in space, curved on Earth",
    "geostrophy and thermal wind"], 3: ["geostrophic adjustment"], 4: ["potential vorticity, the skater and the layer"],
    5: ["balance: from the full equations to QG", "Ekman layers and pumping"], 6: ["Rossby waves"], 7: ["internal waves"],
    8: ["equatorial waves and Matsuno-Gill"], 9: ["baroclinic instability: how weather is born"],
    10: ["waves push the mean flow"], 11: [], 12: ["turbulence on a rotating planet makes jets (merged with ch11, Q4)"],
    13: ["eddies as mixers"], 14: ["the Hadley cell"], 15: ["why westerlies at the surface"],
    16: ["planetary waves and mountains"], 17: ["QBO", "the polar vortex and SSWs"], 18: ["water vapour and the tropics"],
    19: ["wind-driven gyres"], 20: ["the ventilated thermocline"], 21: ["the overturning circulation", "the Southern Ocean"],
    22: ["El Nino"],
}

SMALL = {"a", "an", "and", "as", "at", "by", "for", "from", "in", "of", "on", "or", "the", "to", "with", "vs"}
KEEP = {"PV": "PV", "QG": "QG", "MOC": "MOC", "QBO": "QBO", "ENSO": "ENSO", "WKB": "WKB", "TEM": "TEM", "MJO": "MJO",
        "EP": "EP", "SW": "SW", "II": "II"}


def title_case(s: str) -> str:
    """'THE MASS CONTINUITY EQUATION' -> 'The Mass Continuity Equation' (acronyms and small words handled)."""
    words = re.split(r"(\s+|-|–)", s.strip())
    out, first = [], True
    for w in words:
        if not w or w.isspace() or w in ("-", "–"):
            out.append(w)
            continue
        core = w.strip(":,.()")
        if core.upper() in KEEP:
            nw = w.replace(core, KEEP[core.upper()])
        elif re.match(r"^[A-Z]$", core) and out and "".join(out).rstrip().upper().endswith("APPENDIX"):
            nw = w                                            # APPENDIX A, APPENDIX B
        elif core.lower() in SMALL and not first:
            nw = w.lower()
        else:
            nw = w[:1].upper() + w[1:].lower()
        out.append(nw)
        first = w.endswith(":")
    return "".join(out).replace("Nino", "Niño")


def clean(t: str) -> str:
    return re.sub(r"\s+", " ", t.replace("\r", " ")).strip()


def outline(pdf: Path) -> tuple[int, list[dict]]:
    import pymupdf

    doc = pymupdf.open(pdf)
    toc = [(lvl, clean(t), p) for lvl, t, p in doc.get_toc()]
    starts = [i for i, (lvl, t, _) in enumerate(toc) if lvl == 2 and t.startswith("Chapter")]
    part_pages = [p for lvl, t, p in toc if lvl == 1 and t.startswith("Part")]
    refs = next(p for lvl, t, p in toc if lvl == 1 and t == "References")
    chapters = []
    for k, i in enumerate(starts):
        _, t, p = toc[i]
        m = re.match(r"Chapter\s*(\d+)\s*(.*)", t)
        n, title = int(m.group(1)), m.group(2)
        # chapter ends the page before the next chapter, the next Part divider, or References
        nxt = [toc[j][2] for j in starts[k + 1:k + 2]] + [q for q in part_pages if q > p] + [refs]
        end = min(nxt) - 1
        secs = []
        j = i + 1
        while j < len(toc) and toc[j][0] == 3:
            st, sp = toc[j][1], toc[j][2]
            mm = re.match(r"^(\d+\.\d+)\s*(.*)$", st)
            sec = f"{mm.group(1)} {title_case(mm.group(2))}" if mm else title_case(st)
            secs.append(re.sub(r"Proble$", "Problem", sec))     # one outline entry is truncated in the PDF
            j += 1
        chapters.append({"n": n, "title": title.replace("Mean-Flows", "Mean Flows").replace("Zonally-", "Zonally "),
                         "pdf_start": p, "pdf_end": end, "sections": secs})
    return doc.page_count, chapters


CH00 = {
    "id": "ch00", "number": 0, "title": "Start Here: Maths, Climate Basics and Reading Maps", "slug": "toolkit",
    "do_chapter": True, "book_chapter": False, "notation_pdf_pages": [19, 20],
    "blurb": ("Everything a first-time learner needs before Vallis Chapter 1, in an informal blog-like voice: all of "
              "Kundu Appendix B expanded (0A), the climate and GFD basics (0B), and how to read climate figures (0C)."),
    "sources": {"kundu_appendix_b": "_private/Kundu_AppendixB_Mathematical_Tools.pdf (Kundu PDF pp. 884-895, "
                                    "printed 857-868; private, never published)"},
    "explainers_per_part": {"target": 12, "min": 5, "soft": True,
                            "note": "Q11 (user, 2026-10-20): per part, about 12 each, a soft target; tools warn, never fail"},
    "tier_a_per_part_max": 18,
    "parts": [
        {"id": "ch00a", "slug": "maths", "title": "0A · Maths from Scratch",
         "notebook": "notebooks/ch00a_maths.ipynb",
         "content": "All of Kundu App. B (B.1-B.6, item by item, PLANNING §15.5) + Taylor, complex exponentials, "
                    "Fourier, ODE basics, scaling and nondimensional numbers",
         "viz_seeds": ["vector_products_lab [3D]", "vector_identity_builder [3D]", "partial_derivative_slicer [3D]",
                       "chain_rule_and_jacobian", "gradient_hillwalk [3D]", "divergence_curl_paddles [3D]",
                       "flux_box_budget [3D]", "laplacian_neighbours", "dirac_delta_spike",
                       "coordinates_and_unit_vectors [3D]", "taylor_linearise", "complex_wave_pointer [3D]",
                       "material_derivative_balloon", "scaling_orders_of_magnitude"]},
        {"id": "ch00b", "slug": "climate_basics", "title": "0B · Climate and GFD Basics",
         "notebook": "notebooks/ch00b_climate_basics.ipynb",
         "content": "The 17 groups of PLANNING §15.6, each concept tiered A/B/C; mechanism cards (R4 §4)",
         "viz_seeds": ["thin_shell_to_scale [3D]", "hydrostatic_column", "isobaric_surface_3d [3D]", "buoyancy_parcel",
                       "coriolis_turntable_globe [3D]", "geostrophic_wind_reader", "vorticity_spin_meter [3D]",
                       "pv_skater_column [3D]", "thermal_wind_tilt [3D]", "climate_machine_tour [3D]"]},
        {"id": "ch00c", "slug": "reading_maps", "title": "0C · Reading Climate Figures",
         "notebook": "notebooks/ch00c_reading_maps.ipynb",
         "content": "Every figure type the book uses, each with a reading card (R4 §3), practised on anonymous open data "
                    "(NCEP R1 500 hPa and zonal-mean u, ERSST v5, FU-Berlin QBO)",
         "viz_seeds": ["contour_colour_reader", "sphere_to_map [3D]", "height_map_reader", "section_and_vertical_axes [3D]",
                       "streamfunction_reader [3D]", "hovmoller_qbo_reader", "spectrum_reader", "isosurface_reader [3D]"]},
    ],
    "scenes": ["earth_thin_shell", "vector_zoo", "the_500hPa_surface", "coriolis_merry_go_round", "pv_skater",
               "globe_unwrapping"],
    "movies": [
        {"id": "m0_1_climate_machine", "title": "The climate machine in three minutes", "batch": 1},
        {"id": "m0_2_spinning_planet", "title": "A spinning planet", "batch": 1},
        {"id": "m0_3_read_a_climate_map", "title": "How to read a climate map", "batch": 1},
        {"id": "m0_4_dot_and_cross", "title": "Arrows that multiply: dot and cross", "batch": 2},
        {"id": "m0_5_grad_div_curl", "title": "Slopes, flux and spin: grad, div, curl", "batch": 2},
        {"id": "m0_6_riding_with_the_flow", "title": "Riding with the flow (optional)", "batch": 2},
    ],
    "movies_note": "Q12 (user, 2026-10-20): batch 1 (M0-1..M0-3) first; the user watches them; batch 2 built with that feedback",
}


def build(pdf: Path) -> dict:
    total, chs = outline(pdf)
    chapters = [CH00]
    for c in chs:
        n = c["n"]
        chapters.append({
            "id": f"ch{n:02d}", "number": n, "title": c["title"], "slug": SLUGS[n],
            "pdf_start": c["pdf_start"], "pdf_end": c["pdf_end"],
            "printed_start": c["pdf_start"] - OFFSET, "printed_end": c["pdf_end"] - OFFSET,
            "do_chapter": True, "sections": c["sections"],
            "viz_seeds": VIZ_SEEDS[n], "movie_seeds": MOVIE_SEEDS[n], "scenes": [],
        })
    return {
        "project": {
            "package": "aofd", "library": "fluidpy", "library_path": "../Fluid Dynamics", "library_repo": "shammun/fluidpy",
            "library_pin": "v0.3.0", "repo": "shammun/aofd", "branch": "main",
            "site_url": "https://shammun.github.io/aofd", "media_repo": "shammun/aofd-media",
            "media_url": "https://shammun.github.io/aofd-media", "kundu_site": "https://shammun.github.io/fluidpy",
            "site_title": ("Atmospheric and Oceanic Fluid Dynamics (Vallis, 2nd ed.) — worked in Python, "
                           "with 3-D explainers and movies"),
            "author": "Shammunul Islam",
            "min_explainers_per_chapter": 5, "max_explainers_per_chapter": 14, "max_parallel_viz": 3,
            "max_parallel_agents": 6, "movies_per_chapter": [1, 3], "movie_seconds": [120, 180],
            "scenes_per_chapter": [0, 4], "page_budget_mb": 15, "three_version": "0.186.1",
            "tts": {"engine": "kokoro", "voice": "af_bella", "speed": 1.0},
        },
        "policy": {"tier_a_full_treatment": [12, 18], "coverage": "exhaustive", "equation_code": "all_computable",
                   "kundu_recap": "full_first_use"},
        "data": {
            "root": "G:/Geophysical Fluid Dynamics/aofd-data", "root_env": "AOFD_DATA_ROOT", "colab_root": "/content/aofd-data",
            "layout": ["raw", "derived", "scratch", "logs", "cache"],
            "guard": {"G": {"floor_gb": 50, "project_cap_gb": 150}, "C": {"floor_gb": 40}},
            "derived_in_repo": {"max_file_mb": 10, "max_total_mb": 150, "redistributable_only": True},
        },
        "book": {
            "title": "Atmospheric and Oceanic Fluid Dynamics: Fundamentals and Large-Scale Circulation",
            "edition": "2nd", "authors": ["Geoffrey K. Vallis"], "publisher": "Cambridge University Press", "year": 2017,
            "pdf": "auto", "pdf_pages": total, "printed_offset": OFFSET, "notation_pdf_pages": [19, 20],
            "parts": [
                {"n": "I", "title": "Fundamentals of Geophysical Fluid Dynamics", "chapters": [1, 5]},
                {"n": "II", "title": "Waves, Instabilities and Turbulence", "chapters": [6, 13]},
                {"n": "III", "title": "Large-Scale Atmospheric Circulation", "chapters": [14, 18]},
                {"n": "IV", "title": "Large-Scale Oceanic Circulation", "chapters": [19, 22]},
            ],
        },
        "chapters": chapters,
    }


HEADER = """# Chapter map for Vallis, *Atmospheric and Oceanic Fluid Dynamics: Fundamentals and Large-Scale Circulation*,
# 2nd ed. (CUP, 2017). GENERATED by tools/make_book_yaml.py from the PDF's own bookmark outline + PLANNING.md §3/§9.1/§15.
#   pdf_start/pdf_end : 1-based PDF pages, inclusive (tools/split_pdf.py uses these: no offset guessing)
#   printed_start/end : printed page numbers (pdf = printed + 20)
#   sections          : numbered sections from the outline (our title case); each chapter's appendices belong to it
#   viz_seeds / movie_seeds : PRIORS for the concept-curator ([3D] = three.js view expected to help), not decisions
#   ch00              : not a book chapter; three parts with their own notebooks (PLANNING §9.1, §15)
"""


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--print", action="store_true")
    a = ap.parse_args()
    pdf = max((p for p in ROOT.glob("*.pdf") if p.is_file()), key=lambda p: p.stat().st_size)
    text = HEADER + "\n" + yaml.safe_dump(build(pdf), sort_keys=False, allow_unicode=True, width=120)
    if a.print:
        print(text)
        return 0
    dest = ROOT / "book.yaml"
    if dest.exists() and not a.force:
        sys.exit("book.yaml exists; use --force to regenerate (hand annotations would be lost)")
    dest.write_text(text, encoding="utf-8")
    print(f"wrote {dest.name}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
