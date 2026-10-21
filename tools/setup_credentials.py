"""Write the data-account credential files in your home folder, safely (CREDENTIALS_GUIDE.docx).

Nothing is printed back and nothing is written inside the repo. Existing files are backed up first.
    .venv/Scripts/python.exe tools/setup_credentials.py cds         -> %USERPROFILE%\\.cdsapirc
    .venv/Scripts/python.exe tools/setup_credentials.py earthdata   -> %USERPROFILE%\\_netrc and .netrc
    .venv/Scripts/python.exe tools/setup_credentials.py marine      -> Copernicus Marine credentials file
"""
from __future__ import annotations

import datetime as dt
import getpass
import shutil
import sys
from pathlib import Path

HOME = Path.home()
CDS_URL = "https://cds.climate.copernicus.eu/api"
EARTHDATA_HOST = "urs.earthdata.nasa.gov"


def backup(path: Path) -> None:
    """Copy an existing file to <name>.backup-YYYYMMDD-HHMMSS before it is replaced."""
    if path.exists():
        stamp = dt.datetime.now().strftime("%Y%m%d-%H%M%S")
        copy = path.with_name(f"{path.name}.backup-{stamp}")
        shutil.copy2(path, copy)
        print(f"  old file kept as {copy}")


def setup_cds() -> None:
    """Ask for the CDS Personal Access Token and write the two-line .cdsapirc."""
    token = getpass.getpass("Paste your CDS Personal Access Token (hidden), then press Enter: ").strip()
    token = token.removeprefix("key:").strip()   # in case the whole 'key: ...' line was pasted
    if ":" in token or len(token) < 30:
        sys.exit("That does not look like a new CDS token (it should be one long code with no 'uid:' part).")
    path = HOME / ".cdsapirc"
    backup(path)
    path.write_text(f"url: {CDS_URL}\nkey: {token}\n", encoding="ascii")
    print(f"  wrote {path}")


def setup_earthdata() -> None:
    """Ask for the Earthdata username and password and write _netrc (Windows tools) and .netrc (Python)."""
    user = input("Earthdata username: ").strip()
    pwd = getpass.getpass("Earthdata password (hidden): ")
    if not user or not pwd or " " in user:
        sys.exit("Username and password are both needed (and the username has no spaces).")
    line = f"machine {EARTHDATA_HOST} login {user} password {pwd}\n"
    for name in ("_netrc", ".netrc"):
        path = HOME / name
        backup(path)
        kept = []
        if path.exists():  # keep entries for other machines, replace only the Earthdata one
            kept = [ln for ln in path.read_text(encoding="utf-8").splitlines(keepends=True)
                    if EARTHDATA_HOST not in ln]
        path.write_text("".join(kept) + line, encoding="utf-8")
        print(f"  wrote {path}")


def setup_marine() -> None:
    """Run the Copernicus Marine toolbox login, which asks for username and password and checks them."""
    import copernicusmarine
    ok = copernicusmarine.login(force_overwrite=True)
    print("  Copernicus Marine login OK" if ok else "  Copernicus Marine login FAILED - check username/password")


if __name__ == "__main__":
    actions = {"cds": setup_cds, "earthdata": setup_earthdata, "marine": setup_marine}
    if len(sys.argv) != 2 or sys.argv[1] not in actions:
        sys.exit("usage: setup_credentials.py cds|earthdata|marine")
    actions[sys.argv[1]]()
    # keep the encrypted vault (Windows Credential Manager) in step with the files just written
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    import secrets_vault
    secrets_vault.save()
