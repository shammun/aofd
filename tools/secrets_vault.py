"""Keep the project's data-account credentials in the Windows Credential Manager (encrypted with your Windows login).

The vault is the one safe copy: nothing is stored in either repo, in notebooks or in Claude's memory files.
    .venv/Scripts/python.exe tools/secrets_vault.py save       # copy from .cdsapirc / _netrc / Copernicus Marine into the vault
    .venv/Scripts/python.exe tools/secrets_vault.py list       # names stored (values hidden)
    .venv/Scripts/python.exe tools/secrets_vault.py colab      # show the values to paste into Colab Secrets (asks first)
    .venv/Scripts/python.exe tools/secrets_vault.py restore    # rewrite .cdsapirc and _netrc/.netrc from the vault (new laptop)
Open the vault by hand: Control Panel -> Credential Manager -> Windows Credentials -> entries named "aofd".
"""
from __future__ import annotations

import configparser
import re
import sys
from pathlib import Path

import keyring

SERVICE = "aofd"
HOME = Path.home()
NAMES = {
    # name: what it is (shown by `list`)
    "CDSAPI_URL": "Copernicus Climate Data Store API address",
    "CDSAPI_KEY": "Copernicus Climate Data Store personal access token",
    "EARTHDATA_USERNAME": "NASA Earthdata username",
    "EARTHDATA_PASSWORD": "NASA Earthdata password",
    "COPERNICUSMARINE_USERNAME": "Copernicus Marine username (optional)",
    "COPERNICUSMARINE_PASSWORD": "Copernicus Marine password (optional)",
}
# Colab Secrets the notebooks read (PLANNING §13.1, research R3 §6)
COLAB = ["CDSAPI_URL", "CDSAPI_KEY", "EARTHDATA_USERNAME", "EARTHDATA_PASSWORD"]


def read_home_files() -> dict[str, str]:
    """Credentials found in the standard home-folder files."""
    found: dict[str, str] = {}
    rc = HOME / ".cdsapirc"
    if rc.exists():
        for ln in rc.read_text().splitlines():
            k, _, v = ln.partition(":")
            if k.strip() == "url":
                found["CDSAPI_URL"] = v.strip()
            elif k.strip() == "key":
                found["CDSAPI_KEY"] = v.strip()
    for name in ("_netrc", ".netrc"):
        f = HOME / name
        if f.exists():
            m = re.search(r"machine\s+urs\.earthdata\.nasa\.gov\s+login\s+(\S+)\s+password\s+(\S+)", f.read_text())
            if m:
                found["EARTHDATA_USERNAME"], found["EARTHDATA_PASSWORD"] = m.groups()
                break
    cm = HOME / ".copernicusmarine" / ".copernicusmarine-credentials"
    if cm.exists():
        cp = configparser.ConfigParser()
        cp.read(cm)
        for sec in cp.sections():
            if "username" in cp[sec]:
                found["COPERNICUSMARINE_USERNAME"] = cp[sec]["username"]
            if "password" in cp[sec]:
                found["COPERNICUSMARINE_PASSWORD"] = cp[sec]["password"]
    return found


def save() -> None:
    found = read_home_files()
    for name, value in found.items():
        keyring.set_password(SERVICE, name, value)
    print(f"saved {len(found)} entries to Windows Credential Manager (service '{SERVICE}'): {', '.join(found)}")


def list_names() -> None:
    for name, what in NAMES.items():
        state = "stored" if keyring.get_password(SERVICE, name) else "-"
        print(f"{name:27s} {state:7s} {what}")


def colab() -> None:
    if input("This prints secret values on screen. Continue? [y/N] ").strip().lower() != "y":
        return
    print("In Colab: key icon (Secrets) -> Add new secret -> Name / Value -> switch on Notebook access.\n")
    for name in COLAB:
        print(f"{name:20s} {keyring.get_password(SERVICE, name) or '(not stored)'}")
    print("\nClose or clear this window afterwards (cls).")


def restore() -> None:
    url, key = keyring.get_password(SERVICE, "CDSAPI_URL"), keyring.get_password(SERVICE, "CDSAPI_KEY")
    if key:
        (HOME / ".cdsapirc").write_text(f"url: {url or 'https://cds.climate.copernicus.eu/api'}\nkey: {key}\n")
        print("wrote .cdsapirc")
    user, pwd = keyring.get_password(SERVICE, "EARTHDATA_USERNAME"), keyring.get_password(SERVICE, "EARTHDATA_PASSWORD")
    if user and pwd:
        for name in ("_netrc", ".netrc"):
            (HOME / name).write_text(f"machine urs.earthdata.nasa.gov login {user} password {pwd}\n")
        print("wrote _netrc and .netrc")


if __name__ == "__main__":
    actions = {"save": save, "list": list_names, "colab": colab, "restore": restore}
    if len(sys.argv) != 2 or sys.argv[1] not in actions:
        sys.exit("usage: secrets_vault.py save|list|colab|restore")
    actions[sys.argv[1]]()
