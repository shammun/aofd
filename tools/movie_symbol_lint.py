"""movie_symbol_lint.py: find maths that will not render as maths in a Remotion movie's TSX source.

The checklist `movies/ch00/ch00_coordinates/part1_lessons_checklist.md` (rows C1, C2, C4) came from the user's notes on
Coordinates Part 1. The checks are:

* **C1 plain-text maths.** A maths symbol in a PLAIN-TEXT render string is drawn by the sans font, not KaTeX. A combining
  hat puts the hat beside the letter ("θ`"), and "u_r" prints a literal underscore. "Plain text" means any string that
  reaches the screen through something other than a TeX string. That covers the `<Lbl t=…>` / `<Keyword text=…>` /
  `<SourceLine text=…>` props, callout `lines`, `text:` keys of label requests, and JSX text children such as `<text>…</text>`.
  The lint flags these:
    - combining marks U+0300–036F and U+20D0–20FF (hats, dots, bars, arrows);
    - `^` or `_` used as a super/subscript (`v^2`, `u_r`);
    - primes on a letter (`x′`, `e'1`; English apostrophes such as "Earth's" are not flagged);
    - Unicode super/subscripts on a letter or number (`v²`, `e′₁`, `10⁻⁵`); see the unit whitelist below;
    - a Greek letter carrying any of those modifiers.
  A label with `$…$` maths (Part 2's Lbl/Keyword) is plain text outside the dollars and `\\textstyle` KaTeX inside them.
  Strings in a `const NAME = [ … ]` / `{ … }` count as drawn text when NAME is drawn (`NAME.map(…)`, `NAME[i]`, `{NAME}`); a table
  that is only walked by `.forEach` (the CHECK rows) is not.
* **C2 small fractions.** `\\tfrac` always, and `\\frac` wherever KaTeX draws it in text or script style: inside a sub- or
  superscript, an `\\underset` label, another fraction, a matrix/cases cell, after `\\textstyle`, or in `$…$` label maths. Use
  `\\dfrac`. `--strict` flags every `\\frac` (the checklist wording, "write fractions as \\dfrac").
* **C4 regex TeX.** A TeX command in a JS regex literal needs a doubled backslash. `/\\frac/` is FORM FEED + "rac", and
  `/\\mathbf/` matches "mathbf" without the backslash, so the test silently never fires (the CalcStack bug in Part 2).
  Strings passed to `RegExp(...)` are checked the same way.

The parser is a small JS/TSX scanner. It strips comments (`//`, `/* */`, `{/* */}`), tracks strings, template literals,
regex literals and JSX (tags, attributes, text children), and gives every string its context:
the JSX attribute, the object key, the enclosing call, and whether it is a `String.raw` tag.

Explicit whitelist (each entry justified; nothing else is exempt):
* **TeX contexts are not plain text.** A `String.raw` template, a string with an escaped TeX command (`"\\\\hat{…}"`), and
  the values of the TeX props/keys `s`, `tex`, `lhs`, `rhs`, `latex`, `eq` are all rendered by KaTeX, so their `^`, `_`
  and primes are correct. Only C2 applies to them.
* **Non-render strings** cannot reach the screen and are skipped. These are the values of the attributes in
  `NON_TEXT_ATTRS` (ids, colours, SVG geometry, CSS, file names) and the arguments of `AT/SS/SE/K/keepTime/staticFile/…`
  (spoken phrases and scene ids, such as "s08_r_hat", which contain underscores).
* **SI unit exponents** (`m²`, `km²`, `s⁻¹`, `m/s²`, `s⁻²`, `m³`, `kg/m³`) are precomposed glyphs in the label font and
  render correctly. They are units, not maths symbols, so they are allowed after a unit token. `v²` and `10⁻⁵` are still
  flagged.
* **Degree and minute signs.** `°`, and `′`/`″` after a digit (`26°30′`), are angle notation, not primes on a letter.
* **Display-level `\\frac` (C2, default mode only).** The house kit renders every TeX string with a `\\displaystyle` prefix
  (`texHtml` in `movies/src/house/kit/tex.tsx`, used by `TeX`, `Layered` and `CalcStack`). So a top-level `\\frac` is drawn
  exactly like `\\dfrac`: full size, which is what C2 asks for. `--strict` removes this exemption.
* **Inline `// lint-ok: <reason>` marker.** A source line whose comment contains `lint-ok:` followed by a reason (at least
  8 characters) is exempt. The reason is printed with `--show-ok` so every exemption stays visible.
* Folders named `checks` (the static-gate scripts) are not scanned.

Usage:  python tools/movie_symbol_lint.py movies/src/ch00_coordinates_flat [more folders or files] [--strict] [--show-ok] [--json]
Exit 1 on findings, 0 when clean, 2 on bad arguments.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path

# ------------------------------------------------------------------------------------------------------------------ context sets
TEX_ATTRS = {"s", "tex", "lhs", "rhs", "latex", "eq", "math"}
TEX_KEYS = {"s", "tex", "lhs", "rhs", "latex", "eq", "math"}
# attributes whose string values never reach the screen as text
NON_TEXT_ATTRS = {
    "id", "key", "href", "xlinkHref", "src", "d", "points", "transform", "className", "style", "fontFamily", "fontWeight",
    "fontStyle", "textAnchor", "dominantBaseline", "fill", "stroke", "color", "c", "lc", "strokeDasharray", "dash", "strokeLinecap",
    "strokeLinejoin", "paintOrder", "mode", "a", "side", "lut", "kind", "anchor", "align", "cursor", "mask", "clipPath", "filter",
    "markerEnd", "markerStart", "viewBox", "preserveAspectRatio", "gradientUnits", "offset", "stopColor", "type", "from", "durationInFrames",
    "component", "fps", "width", "height", "x", "y", "cx", "cy", "r", "rx", "ry", "x1", "x2", "y1", "y2", "o", "f", "k", "at", "appear",
    "out", "codec", "slug", "tone", "variant", "pos", "where", "corner", "font", "weight", "spacing", "rule", "probe", "box",
}
# object keys whose string values are drawn as plain text
TEXT_KEYS = {"t", "text", "lines", "label", "title", "caption", "tag", "note", "words", "head", "sub", "name", "txt", "unit",
             "line", "keep", "chip", "hint", "word", "msg", "say", "show", "legend", "lab"}
# calls whose string arguments are timing phrases, ids, asset names or error messages (never drawn)
SKIP_CALLS = {"AT", "SS", "SE", "K", "keepTime", "skipTo", "staticFile", "Error", "require", "delayRender", "continueRender", "cancelRender",
              "Sequence", "console", "log", "warn", "error", "getElementById", "querySelector", "setAttribute", "fetch", "useLayerTex",
              "import", "Math", "Date", "describe", "it", "test", "expect", "assertColumnEdges", "floor", "Symbol"}
# calls whose string arguments are code operations on TeX (search/replace), not TeX to be drawn
CODE_CALLS = {"replace", "replaceAll", "includes", "indexOf", "lastIndexOf", "split", "match", "matchAll", "test", "startsWith",
              "endsWith", "rep", "search", "exec"}
REGEX_CALLS = {"RegExp"}

TEX_CMD = re.compile(r"\\[A-Za-z]{2,}")
GREEK = "αβγδεζηθικλμνξοπρστυφχψωΓΔΘΛΞΠΣΦΨΩϑϕϵ"
LETTER = "A-Za-z" + GREEK
SUPSUB = "⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾ⁿⁱ₀₁₂₃₄₅₆₇₈₉₊₋₌₍₎ₐₑₒₓₔₕₖₗₘₙₚₛₜᵢᵣᵤᵥᵦᵧᵨᵩᵪʳˢᵗʰ"
# SI units that may carry a precomposed exponent (whitelist: units, not maths)
UNIT_EXP = re.compile(r"(?:(?<=[\s/·(\d])|^)(?:k?m|s|kg|hPa|Pa|K|W|J|N|rad|cm|mm|day|yr|h)([²³]|⁻[¹²³])(?![A-Za-z])")

COMB = f"{chr(0x0300)}-{chr(0x036F)}{chr(0x20D0)}-{chr(0x20FF)}"   # combining marks (written by code point: invisible in source)
RX_COMBINING = re.compile(f"[{COMB}]")
RX_SUPSUB_SCRIPT = re.compile(rf"[{LETTER}0-9)\]]\s?[\^_]\s?[{{(]?[{LETTER}0-9\-−+′']")
RX_PRIME = re.compile(rf"(?<![{LETTER}])[{LETTER}][′″‴]|(?<![{LETTER}])[{LETTER}]'(?![A-Za-z])")
RX_UNICODE_SS = re.compile(rf"[{LETTER}0-9′)\]][{SUPSUB}]+")
RX_GREEK_MOD = re.compile(rf"[{GREEK}](?:[{COMB}]|[{SUPSUB}]|[′']|\s?[\^_])"
                          rf"|[\^_]\s?[{{]?[{GREEK}]")   # a Greek letter with a modifier, or as a sub/superscript (u_θ)
LINT_OK = re.compile(r"lint-ok:\s*(.{8,})")

VALID_RX_ESC = set("bBdDsSwWnrtvfcxuPpk0")
TEX_NAMES = {
    "frac", "dfrac", "tfrac", "mathbf", "mathrm", "mathit", "mathcal", "boldsymbol", "bm", "hat", "bar", "dot", "ddot", "vec",
    "tilde", "text", "textbf", "textit", "textcolor", "color", "sqrt", "left", "right", "cdot", "times", "approx", "partial",
    "nabla", "Delta", "delta", "theta", "Theta", "alpha", "beta", "gamma", "lambda", "phi", "varphi", "psi", "omega", "Omega",
    "sigma", "rho", "tau", "mu", "nu", "pi", "sin", "cos", "tan", "arctan", "circ", "quad", "qquad", "overline", "underline",
    "underbrace", "overbrace", "underset", "overset", "cancel", "begin", "end", "sum", "int", "oint", "infty", "to", "rightarrow",
    "leftarrow", "Rightarrow", "displaystyle", "operatorname", "prime", "perp", "parallel", "odot", "otimes", "pm", "mp", "le", "ge",
    "neq", "equiv", "propto", "ln", "exp", "log", "max", "min", "lim", "hphantom", "phantom", "vphantom", "boxed", "dfrac",
}


@dataclass
class Str:
    """One string-like piece of source: a literal, a template chunk, a regex literal or a JSX text child."""
    kind: str               # 'str' | 'tpl' | 'raw' | 'regex' | 'jsxtext' | 'attr'
    value: str              # source text between the delimiters (escapes not decoded except for 'jsxtext')
    line: int
    attr: str | None = None  # enclosing JSX attribute name
    key: str | None = None   # object key (direct, or owning the enclosing array)
    call: str | None = None  # innermost enclosing call's callee name
    tag: str | None = None   # JSX parent tag (for text children)
    ident: str | None = None  # `const NAME =` that this string initialises


@dataclass
class Finding:
    file: str
    line: int
    rule: str
    text: str
    detail: str
    ok: str | None = None


@dataclass
class _Br:
    """A bracket inside one code segment: '(' with its callee, '[' with the key/attr that owns it, or '{'."""
    ch: str
    callee: str | None = None
    owner: str | None = None


@dataclass
class _Mode:
    """One entry of the scanner's mode stack.

    kind: 'code' (top level, or a JSX attribute / child expression, or a template ${…}) · 'tag' (inside <Tag …>) ·
    'children' (between <Tag> and </Tag>) · 'tpl' (template literal text).
    """
    kind: str
    tag: str = ""                 # tag / children: the element name
    attr: str | None = None       # code: the JSX attribute this expression is the value of
    brs: list[_Br] = field(default_factory=list)   # code: open brackets of this segment
    raw: bool = False             # tpl: String.raw
    buf: list[str] = field(default_factory=list)   # tpl: current static chunk
    line0: int = 0                # tpl: line of the current chunk
    pending_key: str | None = None
    pending_ident: str | None = None
    prev_tok: str = ""
    prev_word: str = ""


@dataclass
class Scan:
    strings: list[Str] = field(default_factory=list)


# ------------------------------------------------------------------------------------------------------------------ scanner
_ID = re.compile(r"[A-Za-z_$][\w$]*")
_PUNCT_BEFORE_EXPR = set("(,=?:{[!&|;+-*%<>~^") | {""}
_KW_BEFORE_EXPR = {"return", "typeof", "case", "do", "else", "in", "of", "new", "delete", "void", "throw", "yield", "await"}
_JSX_OPEN = re.compile(r"<\s*([A-Za-z_$][\w$.:-]*)?")


def _decode_jsx_text(s: str) -> str:
    return s.replace("&nbsp;", " ").replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")


def _prev_sig_char(src: str, i: int) -> str:
    k = i - 1
    while k >= 0 and src[k].isspace():
        k -= 1
    return src[k] if k >= 0 else ""


def scan(src: str) -> Scan:
    """Tokenise TSX far enough to give every string its render context. Comments are skipped (stripped)."""
    out = Scan()
    n, i, line = len(src), 0, 1
    modes: list[_Mode] = [_Mode("code")]
    decl_at: dict[int, str] = {}     # position of a const initializer's opening bracket -> "@NAME"

    def code_below(k: int | None = None) -> _Mode | None:
        """nearest code segment at or below index k (stops at JSX: a tag/children entry ends the context)."""
        for m in reversed(modes if k is None else modes[: k + 1]):
            if m.kind == "code":
                return m
            if m.kind in ("tag", "children"):
                return None
        return None

    def context() -> tuple[str | None, str | None, str | None, str | None]:
        """(attr, key, call, ident) for a string starting now."""
        cm = code_below()
        if cm is None:
            return None, None, None, None
        key = cm.pending_key
        call = None
        for br in reversed(cm.brs):
            if br.ch == "(":
                call = br.callee
                break
        if key is None:
            for br in reversed(cm.brs):
                if br.ch in "[{" and br.owner:   # an array's key, or "@NAME" for `const NAME = [ … ]` / `{ … }`
                    key = br.owner
                    break
                if br.ch in "({":
                    break
        # the attribute: walk down through code/tpl segments until a JSX attribute expression
        attr = None
        for m in reversed(modes):
            if m.kind == "code" and m.attr is not None:
                attr = m.attr
                break
            if m.kind in ("tag", "children"):
                break
        return attr, key, call, cm.pending_ident

    def add(kind: str, value: str, ln: int, *, tag: str | None = None, attr: str | None = None, ctx=None) -> None:
        a, key, call, ident = ctx if ctx is not None else context()
        out.strings.append(Str(kind, value, ln, attr=attr if attr is not None else a, key=key, call=call, tag=tag, ident=ident))
        cm = code_below()
        if cm is not None:
            cm.pending_key = None
            cm.pending_ident = None

    while i < n:
        top = modes[-1]
        ch = src[i]
        # ================================================================== template literal text
        if top.kind == "tpl":
            if ch == "\\" and i + 1 < n:
                top.buf.append(src[i:i + 2])
                i += 2
                continue
            if ch == "`" or src.startswith("${", i):
                modes.pop()
                add("raw" if top.raw else "tpl", "".join(top.buf), top.line0)
                modes.append(top)
                top.buf = []
                if ch == "`":
                    modes.pop()
                    cm = code_below()
                    if cm is not None:
                        cm.prev_tok, cm.prev_word = "str", ""
                    i += 1
                else:
                    modes.append(_Mode("code"))
                    i += 2
                continue
            if ch == "\n":
                line += 1
            top.buf.append(ch)
            i += 1
            continue
        # ================================================================== JSX children
        if top.kind == "children":
            if ch == "{":
                modes.append(_Mode("code", attr=None, prev_tok="{"))
                i += 1
                continue
            if ch == "<":
                if re.match(r"<\s*/", src[i:]):
                    j = src.index(">", i)
                    line += src.count("\n", i, j)
                    modes.pop()
                    i = j + 1
                    _after_jsx(modes)
                    continue
                m = _JSX_OPEN.match(src, i)
                tag = (m.group(1) or "") if m else ""
                if not tag and src[m.end()] == ">":
                    modes.append(_Mode("children", tag=""))
                    i = m.end() + 1
                    continue
                modes.append(_Mode("tag", tag=tag))
                i = m.end()
                continue
            j = i
            while j < n and src[j] not in "{<":
                j += 1
            text = src[i:j]
            if text.strip():
                lead = text[: len(text) - len(text.lstrip())]
                add("jsxtext", _decode_jsx_text(" ".join(text.split())), line + lead.count("\n"), tag=top.tag, attr="", ctx=(None, None, None, None))
            line += text.count("\n")
            i = j
            continue
        # ================================================================== opening tag: attributes
        if top.kind == "tag":
            if ch.isspace():
                line += ch == "\n"
                i += 1
                continue
            if src.startswith("/>", i):
                modes.pop()
                i += 2
                _after_jsx(modes)
                continue
            if ch == ">":
                top.kind = "children"
                i += 1
                continue
            if ch == "{":
                modes.append(_Mode("code", attr="...spread", prev_tok="{"))
                i += 1
                continue
            m = re.match(r"([A-Za-z_$][\w$:-]*)\s*(=)?\s*", src[i:])
            if not m:
                i += 1
                continue
            attr = m.group(1)
            line += m.group(0).count("\n")
            i += m.end()
            if m.group(2) and i < n:
                if src[i] in "\"'":
                    k = src.index(src[i], i + 1)
                    add("attr", src[i + 1:k], line, attr=attr, ctx=(attr, None, None, None))
                    line += src.count("\n", i, k)
                    i = k + 1
                elif src[i] == "{":
                    modes.append(_Mode("code", attr=attr, prev_tok="{"))
                    i += 1
            continue
        # ================================================================== code
        cm = top
        if ch == "\n":
            line += 1
            i += 1
            continue
        if ch.isspace():
            i += 1
            continue
        if src.startswith("//", i):
            j = src.find("\n", i)
            i = n if j < 0 else j
            continue
        if src.startswith("/*", i):
            j = src.find("*/", i + 2)
            j = n if j < 0 else j + 2
            line += src.count("\n", i, j)
            i = j
            continue
        if ch in "\"'":
            k, start = i + 1, line
            while k < n and src[k] != ch and src[k] != "\n":
                k += 2 if src[k] == "\\" else 1
            add("str", src[i + 1:k], start)
            i = k + 1
            cm.prev_tok, cm.prev_word = "str", ""
            continue
        if ch == "`":
            raw = src[max(0, i - 12):i].rstrip().endswith("String.raw")
            modes.append(_Mode("tpl", raw=raw, line0=line))
            i += 1
            continue
        if ch == "/" and (cm.prev_tok in _PUNCT_BEFORE_EXPR or cm.prev_tok in _KW_BEFORE_EXPR or cm.prev_tok == "=>"):
            k, in_cls = i + 1, False
            while k < n and src[k] != "\n":
                c2 = src[k]
                if c2 == "\\":
                    k += 2
                    continue
                if c2 == "[":
                    in_cls = True
                elif c2 == "]":
                    in_cls = False
                elif c2 == "/" and not in_cls:
                    break
                k += 1
            add("regex", src[i + 1:k], line)
            k += 1
            while k < n and src[k].isalpha():
                k += 1
            i = k
            cm.prev_tok, cm.prev_word = "regex", ""
            continue
        if ch == "<" and (cm.prev_tok in _PUNCT_BEFORE_EXPR or cm.prev_tok in _KW_BEFORE_EXPR or cm.prev_tok == "=>") and \
                re.match(r"<\s*[A-Za-z>]", src[i:]):
            m = _JSX_OPEN.match(src, i)
            tag = m.group(1) or ""
            if not tag:          # fragment <>
                modes.append(_Mode("children", tag=""))
                i = m.end() + 1
                continue
            modes.append(_Mode("tag", tag=tag))
            i = m.end()
            continue
        m = _ID.match(src, i)
        if m:
            word, j = m.group(0), m.end()
            if re.match(r"\s*\??:(?!:)", src[j:j + 4]) and _prev_sig_char(src, i) in "{,":
                cm.pending_key = word
            elif word in ("const", "let", "var"):
                mm = re.match(r"\s+([A-Za-z_$][\w$]*)\s*(?::[^=\n]+)?=\s*(?=[\"'`])", src[j:])
                cm.pending_ident = mm.group(1) if mm else None
                md = re.match(r"\s+([A-Za-z_$][\w$]*)\s*(?::[^=\n]+)?=\s*(?=[\[{])", src[j:])
                if md:                       # `const NAME = [ … ]`: strings inside belong to NAME (render data if NAME is drawn)
                    decl_at[j + md.end()] = "@" + md.group(1)
            cm.prev_tok = word if word in _KW_BEFORE_EXPR else "id"
            cm.prev_word = word
            i = j
            continue
        if ch.isdigit() or (ch == "." and i + 1 < n and src[i + 1].isdigit()):
            mm = re.match(r"[\d.]+(?:[eE][+-]?\d+)?|0[xX][\da-fA-F]+", src[i:])
            i += mm.end() if mm else 1
            cm.prev_tok, cm.prev_word = "num", ""
            continue
        if src.startswith("=>", i):
            cm.prev_tok, cm.prev_word = "=>", ""
            i += 2
            continue
        if ch in "([{":
            br = _Br(ch)
            if ch == "(" and cm.prev_tok == "id":
                br.callee = cm.prev_word
            if ch == "[":
                br.owner = cm.pending_key if cm.pending_key is not None else (cm.attr if not cm.brs else None)
            if i in decl_at:
                br.owner = decl_at[i]
            cm.pending_key = None
            cm.brs.append(br)
            cm.prev_tok, cm.prev_word = ch, ""
            i += 1
            continue
        if ch in ")]}":
            if cm.brs:
                cm.brs.pop()
                cm.prev_tok, cm.prev_word = (")" if ch != "}" else "}"), ""
                cm.pending_key = None
                i += 1
                continue
            if ch == "}" and len(modes) > 1:   # end of a JSX attribute/child expression or a template ${…}
                modes.pop()
                i += 1
                continue
            i += 1
            continue
        if ch == ",":
            cm.pending_key = None
        cm.prev_tok, cm.prev_word = ch, ""
        i += 1
    return out


def _after_jsx(modes: list[_Mode]) -> None:
    """A JSX element just closed: if we are back in code, the element acts as a value (an operand, not an operator)."""
    if modes and modes[-1].kind == "code":
        modes[-1].prev_tok, modes[-1].prev_word = ")", ""


# ------------------------------------------------------------------------------------------------------------------ classification
def _is_tex(s: Str) -> bool:
    if s.kind == "raw":
        return True
    if s.attr in TEX_ATTRS or (s.key in TEX_KEYS):
        return True
    if s.kind not in ("str", "tpl", "attr") or split_dollar(s.value)[1]:
        return False      # a label with $…$ maths is plain text with TeX segments (Part 2's Lbl/Keyword), handled per segment
    # a TeX command: escaped in a JS string ("\\hat"), literal in a JSX attribute string (t="\hat" has no escapes)
    return bool(re.search(r"\\\\[A-Za-z]{2,}" if s.kind != "attr" else r"\\[A-Za-z]{2,}", s.value))


def _is_render_text(s: Str, text_consts: set[str]) -> bool:
    """Plain text that reaches the screen."""
    if s.kind in ("regex",):
        return False
    if s.kind == "jsxtext":
        return s.tag not in ("style", "script")
    if _is_tex(s):
        return False
    if s.call in SKIP_CALLS or s.call in CODE_CALLS or s.call in REGEX_CALLS:
        return False
    if s.attr is not None and s.attr != "...spread":
        if s.attr in NON_TEXT_ATTRS and s.key not in TEXT_KEYS:
            return False
        if s.key is not None and s.key not in TEXT_KEYS:
            return False
        return True
    if s.key is not None and s.key.startswith("@"):
        return s.key in text_consts      # a const array/object that is drawn (NAME.map(…) / NAME[i] / {NAME}), not a CHECK table
    if s.key is not None:
        return s.key in TEXT_KEYS
    if s.ident is not None:
        return s.ident in text_consts
    return False


def _unit_masked(text: str) -> str:
    """Blank the whitelisted SI-unit exponents and angle minutes/seconds so the symbol rules do not see them."""
    t = UNIT_EXP.sub(lambda m: m.group(0)[: -len(m.group(1))] + " " * len(m.group(1)), text)
    t = re.sub(r"(?<=\d)[′″]", " ", t)
    return t


def plain_text_findings(text: str) -> list[tuple[str, str]]:
    t = _unit_masked(text)
    hits: list[tuple[str, str]] = []
    if m := RX_COMBINING.search(t):
        hits.append(("C1-combining", f"combining mark U+{ord(m.group(0)):04X} after {t[max(0, m.start() - 1)]!r}"))
    if m := RX_SUPSUB_SCRIPT.search(t):
        hits.append(("C1-script", f"'{m.group(0)}': ^ or _ as a super/subscript"))
    if m := RX_PRIME.search(t):
        hits.append(("C1-prime", f"'{m.group(0)}': prime on a letter"))
    if m := RX_UNICODE_SS.search(t):
        hits.append(("C1-unicode-script", f"'{m.group(0)}': Unicode super/subscript"))
    if m := RX_GREEK_MOD.search(t):
        hits.append(("C1-greek", f"'{m.group(0)}': Greek letter with a modifier"))
    return hits


def _regex_tex_findings(pattern: str) -> list[str]:
    bad = []
    for m in re.finditer(r"(\\+)([A-Za-z]{2,})", pattern):
        if len(m.group(1)) % 2 == 0:   # \\frac: an escaped backslash, then the word: correct
            continue
        name = m.group(2)
        hit = next((t for t in sorted(TEX_NAMES, key=len, reverse=True) if name.startswith(t)), None)
        if hit or name[0] not in VALID_RX_ESC:
            bad.append("\\" + name)
    return bad


def _js_unescape(s: str) -> str:
    return re.sub(r"\\(.)", lambda m: {"n": "\n", "t": "\t"}.get(m.group(1), m.group(1)), s)

def split_dollar(text: str) -> tuple[str, list[str]]:
    """Plain part and the $…$ maths segments of a label (an unpaired $ is plain text)."""
    parts = text.split("$")
    if len(parts) < 3 or len(parts) % 2 == 0:
        return text, []
    return " ".join(parts[0::2]), parts[1::2]


_SCRIPT_FIRST = {"underset", "overset", "stackrel"}       # first argument is drawn in script style
_FRAC_CMDS = {"frac", "dfrac", "tfrac", "cfrac", "binom", "dbinom", "tbinom"}
_STYLE_CMDS = {"textstyle": "text", "scriptstyle": "script", "scriptscriptstyle": "script", "displaystyle": "display"}
_SMALL_ENVS = re.compile(r"(?:p|b|v|V|B|small)?matrix|array|cases|aligned|gathered")


def frac_findings(body: str, display: bool = True, strict: bool = False) -> list[tuple[str, str]]:
    r"""C2: every \tfrac, and every \frac that KaTeX draws in text or script style.

    Whitelist (explicit): the house kit renders every TeX string with a `\displaystyle` prefix (`texHtml`, used by `TeX`,
    `Layered`, `CalcStack`), so a `\frac` at display level is drawn exactly like `\dfrac`, full size, and is fine. Display
    level means not inside a sub/superscript, an \underset/\overset label, another fraction's numerator or denominator, a
    matrix/array/cases cell, or after \textstyle / \scriptstyle. `strict=True` flags every \frac anyway (the checklist
    wording C2, "write fractions as \dfrac").
    """
    out: list[tuple[str, str]] = []
    stack: list[str] = ["display" if display else "text"]   # style inside each open brace group
    pending: list[str] = []                                   # styles for the next brace groups (arguments)
    saved: list[list[str]] = []                               # pending argument styles of each enclosing level
    i, n = 0, len(body)
    while i < n:
        c = body[i]
        if c == "\\":
            m = re.match(r"\\([A-Za-z]+)", body[i:])
            if not m:
                i += 2
                continue
            name, cur = m.group(1), stack[-1]
            i += m.end()
            if name == "tfrac":
                out.append((name, "draws a small inline fraction"))
            elif name == "frac" and strict:
                out.append((name, "is not \\dfrac (strict mode)"))
            elif name == "frac" and cur != "display":
                out.append((name, f"sits in {cur} style here, so it is drawn small"))
            if name in _FRAC_CMDS:
                inner = "text" if (name in ("dfrac", "dbinom") or cur == "display") else "script"
                if name in ("tfrac", "tbinom"):
                    inner = "script"
                pending = [inner, inner]
            elif name in _SCRIPT_FIRST:
                pending = ["script", cur]
            elif name in _STYLE_CMDS:
                stack[-1] = _STYLE_CMDS[name]
            elif name in ("begin", "end"):
                mm = re.match(r"\{([A-Za-z*]+)\}", body[i:])
                if mm and _SMALL_ENVS.fullmatch(mm.group(1).rstrip("*")):
                    if name == "begin":
                        stack.append("text")
                    elif len(stack) > 1:
                        stack.pop()
                    i += mm.end()
            continue
        if c in "^_":
            j = i + 1
            while j < n and body[j] == " ":
                j += 1
            pending = ["script"] if j < n and body[j] == "{" else []
            i = j
            continue
        if c == "{":
            stack.append(pending.pop(0) if pending else stack[-1])
            saved.append(pending)     # the remaining argument styles wait until this group closes
            pending = []
            i += 1
            continue
        if c == "}":
            if len(stack) > 1:
                stack.pop()
            pending = saved.pop() if saved else []
            i += 1
            continue
        if not c.isspace():
            pending = []
        i += 1
    return out


def lint_source(src: str, fname: str = "<src>", strict: bool = False) -> list[Finding]:
    sc = scan(src)
    lines = src.splitlines()
    # const NAME = "..." used later as a text prop value (text={NAME} / t={NAME} / lines={[NAME]})
    text_consts: set[str] = set()
    for m in re.finditer(r"\b(t|text|lines|label|title|caption|tag|note|name)\s*=\s*\{\s*\[?\s*([A-Z_][A-Z0-9_]*)\b", src):
        text_consts.add(m.group(2))
    for m in re.finditer(r"\b(?:t|text|label|title|caption|tag|note|name)\s*:\s*([A-Z_][A-Z0-9_]*)\b", src):
        text_consts.add(m.group(1))
    # const arrays/objects whose entries are drawn: used by .map/.filter/.find/.flatMap, indexed, spread or passed as {NAME};
    # tables only walked by .forEach (the CHECK rows) or never used are not render data
    for name in set(re.findall(r"\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*(?::[^=\n]+)?=\s*[\[{]", src)):
        if re.search(rf"\b{re.escape(name)}\s*(?:\.(?:map|filter|find|flatMap|slice|at)\s*\(|\[)|\.\.\.{re.escape(name)}\b|=\{{\s*{re.escape(name)}\s*\}}", src):
            text_consts.add("@" + name)
    found: list[Finding] = []

    def ok_reason(ln: int) -> str | None:
        line_txt = lines[ln - 1] if 0 < ln <= len(lines) else ""
        m = LINT_OK.search(line_txt)
        return m.group(1).strip() if m else None

    for s in sc.strings:
        val = s.value
        if s.kind == "regex":
            for cmd in _regex_tex_findings(val):
                found.append(Finding(fname, s.line, "C4-regex", f"/{val}/", f"{cmd} in a regex literal needs \\\\ ({cmd[1:]} as written matches something else)"))
            continue
        if s.call in REGEX_CALLS:
            for cmd in _regex_tex_findings(_js_unescape(val)):
                found.append(Finding(fname, s.line, "C4-regex", val, f"RegExp source has {cmd}: write \\\\\\\\{cmd[1:]} in the string"))
            continue
        if _is_tex(s) and s.call not in CODE_CALLS:
            body = val if s.kind in ("raw", "attr") else _js_unescape(val)
            for name, why in frac_findings(body, display=True, strict=strict):
                found.append(Finding(fname, s.line, "C2-frac", val[:90], f"\\{name} {why}: use \\dfrac"))
            continue
        if _is_render_text(s, text_consts):
            txt = val if s.kind in ("jsxtext", "attr") else _js_unescape(val)
            plain, maths = split_dollar(txt)
            for rule, det in plain_text_findings(plain):
                found.append(Finding(fname, s.line, rule, val[:90], det))
            for seg in maths:   # $…$ maths inside a label: KaTeX in \textstyle (Part 2's Lbl/Keyword), so every \frac is inline
                for name, why in frac_findings(seg, display=False, strict=strict):
                    found.append(Finding(fname, s.line, "C2-frac", val[:90], f"\\{name} {why} ($…$ label maths is \\textstyle): use \\dfrac"))
    for fd in found:
        fd.ok = ok_reason(fd.line)
    return found


def lint_paths(paths: list[Path], strict: bool = False) -> list[Finding]:
    files: list[Path] = []
    for p in paths:
        if p.is_dir():
            files += sorted(q for q in p.rglob("*") if q.suffix in (".tsx", ".ts", ".jsx", ".mjs") and "node_modules" not in q.parts
                            and "checks" not in q.parts)
        elif p.is_file():
            files.append(p)
    out: list[Finding] = []
    for f in files:
        out += lint_source(f.read_text(encoding="utf-8"), str(f), strict=strict)
    return out


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("paths", nargs="+", type=Path, help="movie source folder(s) or file(s)")
    ap.add_argument("--show-ok", action="store_true", help="also list findings exempted by a `lint-ok:` comment")
    ap.add_argument("--json", action="store_true", help="print findings as JSON")
    ap.add_argument("--strict", action="store_true", help="C2: flag every frac, even the display-level ones the house draws full size")
    a = ap.parse_args(argv)
    missing = [p for p in a.paths if not p.exists()]
    if missing:
        print(f"no such path: {', '.join(map(str, missing))}", file=sys.stderr)
        return 2
    fs = lint_paths(a.paths, strict=a.strict)
    bad = [f for f in fs if not f.ok]
    oks = [f for f in fs if f.ok]
    if a.json:
        print(json.dumps([f.__dict__ for f in (fs if a.show_ok else bad)], ensure_ascii=False, indent=1))
    else:
        for f in bad:
            print(f"{f.file}:{f.line}: {f.rule}: {f.detail}\n    {f.text}")
        if a.show_ok:
            for f in oks:
                print(f"{f.file}:{f.line}: {f.rule} (lint-ok: {f.ok})\n    {f.text}")
        print(f"movie_symbol_lint: {len(bad)} finding(s), {len(oks)} exempted (lint-ok) in {', '.join(map(str, a.paths))}")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.exit(main())
