# AOFD Vallis — Setting Up the Three Data Accounts

This guide covers only one job: creating the three free data accounts and saving their keys on this laptop, so that
the project can download ERA5, NASA and ocean data by itself. Do the parts in order. Altogether it takes about
30–40 minutes, mostly waiting for confirmation emails.

| Part | Account | What it unlocks | Needed |
|---|---|---|---|
| A | Copernicus Climate Data Store (CDS) | ERA5 reanalysis: winds, temperature, heights, QBO, fluxes | **now** |
| B | NASA Earthdata | ECCO ocean state estimate, MERRA-2, CERES, AIRS | before about Chapter 12 (doing it now is easiest) |
| C | Copernicus Marine | mean dynamic topography, satellite altimetry, ocean currents | optional |

**Three safety rules:**

- These keys are like passwords. Never paste them into a chat, an email, a notebook or a file inside the project
  folder. They live only in your home folder `C:\Users\sislam27\`, and the project's `.gitignore` blocks them.
- The helper script used below hides what you type. When you paste a token or type a password, **nothing appears on
  screen**. That is normal: paste, then press Enter.
- Every step that changes a file first keeps a backup copy of the old file next to it, named
  `<name>.backup-<date>-<time>`.

**How to open PowerShell in the project folder** (used in every part):

1. Press the **Windows key**, type `PowerShell`, and press **Enter**.
2. Type this line and press **Enter**:

```powershell
cd "C:\Users\sislam27\Work\Climate Dynamics PHD\AOFD Vallis"
```

The prompt now ends in `AOFD Vallis>`. Keep this window open for the whole guide.

## Part A — Copernicus Climate Data Store (ERA5)

**Why this is needed:** your current file `C:\Users\sislam27\.cdsapirc` points to
`https://ads.atmosphere.copernicus.eu/api/v2`. That is the *Atmosphere* Data Store (air-quality data, not ERA5),
and the `/api/v2` address with its old `12345:abcd…` style key was switched off in 2024. The new system uses one long
**Personal Access Token** instead.

### A1. Log in, or create an account

1. Open **https://cds.climate.copernicus.eu** in your browser.
2. At the top right, click **Login – Register**.
3. **If you already have an ECMWF or CDS account** (you probably do, since you had an ADS key), enter your email and
   password and click **Log In**. Your old ADS login uses the same ECMWF account. If you forgot the password, click
   **Forgot password?** on that page.
4. **If you have no account:** click **Register**, fill in your name, email and password, tick the boxes and submit.
   Open the confirmation email from ECMWF and click its link. Then come back and log in as in step 3.
5. After the first login you may be asked to complete your profile and **accept the general CDS Terms of Use**. Read
   them and click **Accept**.

### A2. Copy your Personal Access Token

1. Open **https://cds.climate.copernicus.eu/how-to-api** (while logged in).
2. Find the section **"Setup the CDS API personal access token"**. It shows a black box with two lines:

```text
url: https://cds.climate.copernicus.eu/api
key: 1a2b3c4d-....-....-....-............
```

3. Copy **only the code after `key:`**: select it with the mouse and press **Ctrl + C**. It is one long code with
   dashes and **no colon** in it.
   - The same token is also on your profile page: **https://cds.climate.copernicus.eu/profile**, under
     **Personal Access Token**.

### A3. Accept the ERA5 licence on each dataset you will use

The CDS refuses a download until you have accepted the licence on that dataset's page. Do this for each of these four
pages. They all use the same CC-BY licence, so after the first one the others usually show it as already accepted.

| Dataset | Direct link to its download tab |
|---|---|
| ERA5 monthly averaged data on single levels | https://cds.climate.copernicus.eu/datasets/reanalysis-era5-single-levels-monthly-means?tab=download |
| ERA5 monthly averaged data on pressure levels | https://cds.climate.copernicus.eu/datasets/reanalysis-era5-pressure-levels-monthly-means?tab=download |
| ERA5 hourly data on pressure levels | https://cds.climate.copernicus.eu/datasets/reanalysis-era5-pressure-levels?tab=download |
| ERA5 hourly data on single levels | https://cds.climate.copernicus.eu/datasets/reanalysis-era5-single-levels?tab=download |

On each page:

1. Make sure the **Download** tab is selected (the link opens it).
2. **Scroll to the very bottom** of the download form, past Product type, Variable, Year, Month, Time,
   Geographical area, Data format and Download format.
3. Just above *Corresponding API request* and the grey *Submit form* button is a box called **Terms of use**,
   with a link **CC-BY licence** under it.
4. **If it shows ✓ Accepted**, you have already accepted this licence and there is nothing to do on this page.
   **If it shows an Accept button**, click **Accept**; the box then changes to ✓ Accepted.
5. You do **not** need to fill in the form or click *Submit form* (it stays grey and says *Please check
   mandatory fields*; that is fine). Accepting the licence is enough.

### A4. Save the token on this laptop

In the PowerShell window from the start:

```powershell
.venv\Scripts\python.exe tools\setup_credentials.py cds
```

1. It asks: *Paste your CDS Personal Access Token (hidden)*.
2. **Right-click** inside the PowerShell window (or press **Ctrl + V**) to paste the token. Nothing appears. Press
   **Enter**.
3. It prints `old file kept as C:\Users\sislam27\.cdsapirc.backup-…` and `wrote C:\Users\sislam27\.cdsapirc`.

If you still use the Atmosphere Data Store for other work, that backup holds your old ADS settings.

*Manual alternative (only if the script fails):* open **Notepad**, type the two lines from step A2 (the `url:` line
and the `key:` line with your token), click **File → Save As**, go to `C:\Users\sislam27`, set **Save as type** to
**All files (\*.\*)**, type the file name `.cdsapirc` and click **Save**. Make sure Notepad did not add `.txt`.

### A5. Test it

```powershell
.venv\Scripts\python.exe tools\check_data_access.py cds
```

**Expected:** `OK  cds_era5  ERA5 one-point request OK (… bytes, deleted)`. The request is tiny, but the CDS
queues it, so it can take 10 seconds to a few minutes.

| If you see | Do this |
|---|---|
| `NEEDS LOGIN … must say url: https://cds.climate.copernicus.eu/api` | the file was not replaced; repeat A4 |
| `required licences not accepted` or `403 Forbidden` | repeat A3 for the dataset it names |
| `401 Unauthorized` / `invalid token` | the token was copied wrongly; copy it again from A2 and repeat A4 |
| It waits a long time | normal when the CDS queue is busy; leave it running |

## Part B — NASA Earthdata

### B1. Create the account

1. Open **https://urs.earthdata.nasa.gov/users/new**.
2. Fill in the form:
   - **Username:** lowercase letters and numbers, no spaces. Write it down.
   - **Password:** at least 12 characters with upper case, lower case and a number. Write it down somewhere safe.
   - Email, name, country, affiliation (*Education*) and study area (*Atmosphere* or *Oceans*).
3. Tick the box agreeing to the **Earthdata Login policy**, then click **Register for Earthdata Login**.
4. Open the email from **NASA Earthdata Login** (check spam too) and click **Click here to activate your account**.
   You cannot download anything until the account is activated.
5. Log in at **https://urs.earthdata.nasa.gov** with the new username and password.

### B2. Approve the two data centres

Scripts can't click "I agree" pop-ups, so the data centres must be approved once in the browser.

1. While logged in at **https://urs.earthdata.nasa.gov/profile**, click the **Applications** tab in the top bar,
   then click **Authorized Apps**.
2. Scroll to the bottom and click **APPROVE MORE APPLICATIONS**.
3. In the search box, type `GES DISC` and click the green **SEARCH** button.
4. Find **NASA GESDISC DATA ARCHIVE** and click its **APPROVE** button. If an agreement page appears, read it, tick
   any boxes and click the green **AUTHORIZE** button. (GES DISC holds MERRA-2 and AIRS.)
5. You are taken back to *Authorized Apps*, and **NASA GESDISC DATA ARCHIVE** is now in the list.
6. Click **APPROVE MORE APPLICATIONS** again, search for `PODAAC`, and approve the PO.DAAC application(s) in the
   results (for example *PODAAC OPS Cumulus*). PO.DAAC holds the ECCO ocean state estimate. If no PO.DAAC application
   appears, that's fine: it is approved automatically on the first download.
7. Optional, for CERES radiation data: search `ASDC` or `LaRC` and approve the **NASA Langley ASDC** application if
   it is listed.

### B3. Save the login on this laptop

In PowerShell:

```powershell
.venv\Scripts\python.exe tools\setup_credentials.py earthdata
```

1. Type your Earthdata **username** and press **Enter** (this one is visible).
2. Type your **password** (hidden) and press **Enter**.
3. It writes two copies: `C:\Users\sislam27\_netrc`, read by Windows download tools, and `C:\Users\sislam27\.netrc`,
   read by Python. Each holds one line:

```text
machine urs.earthdata.nasa.gov login <your-username> password <your-password>
```

*Manual alternative:* in Notepad, type that line with your details and save it twice with **Save as type: All files**
in `C:\Users\sislam27`, once as `_netrc` and once as `.netrc` (no `.txt`).

### B4. Test it

```powershell
.venv\Scripts\python.exe tools\check_data_access.py earthdata
```

**Expected:** `OK  nasa_earthdata  logged in; ECCO search returned 1 collection(s)`.

| If you see | Do this |
|---|---|
| `Earthdata rejected the credentials` | wrong username or password, or the account is not yet activated (B1 step 4); repeat B3 |
| `no ~/_netrc` | B3 did not run; repeat it |
| Later, a download fails with `401` or a redirect to a login page | the data centre is not approved; repeat B2 |

## Part C — Copernicus Marine (optional)

### C1. Create the account

1. Open **https://data.marine.copernicus.eu/register**.
2. Fill in username, email, password, name, country and sector (*Research / Education*), and tick the terms box.
   Click **Register** (or **Create account**).
3. Open the confirmation email from **Copernicus Marine Service** and click the activation link.
4. Check that you can log in at **https://data.marine.copernicus.eu** (top right, **Login**).

### C2. Save the login on this laptop

```powershell
.venv\Scripts\python.exe tools\setup_credentials.py marine
```

1. It asks for your Copernicus Marine **username** (or the email you registered with). Type it and press **Enter**.
2. It asks for your **password** (hidden). Type it and press **Enter**.
3. The toolbox checks the login with the server and saves it in
   `C:\Users\sislam27\.copernicusmarine\.copernicusmarine-credentials`. It prints `Copernicus Marine login OK`.

The same thing can be done directly with `.venv\Scripts\copernicusmarine.exe login --force-overwrite`.

### C3. Test it

```powershell
.venv\Scripts\python.exe tools\check_data_access.py marine
```

**Expected:** `OK  copernicus_marine  credentials valid`.

## Part D — Final check of everything

```powershell
.venv\Scripts\python.exe tools\check_data_access.py
```

**Expected:** seven `OK` lines (four sources that need no account, then CDS, Earthdata and Copernicus Marine), plus
the free space on C: and G: before and after. If you skipped Part C, its line says `NEEDS LOGIN`, which is fine.

When it is done, tell Claude Code:

```prompt
Data accounts are set up; check_data_access.py shows OK for: <list>.
```

## Part E — Using the accounts on Google Colab (later, only when a notebook needs fresh data)

Colab notebooks normally load small ready-made data files and need **no keys**. Only if you choose to refresh data
on Colab:

1. In Colab, click the **key icon** (🔑 *Secrets*) in the left sidebar.
2. To see the values to paste, run this on the laptop. It asks before showing anything:

```powershell
.venv\Scripts\python.exe tools\secrets_vault.py colab
```

3. Click **Add new secret** and add each of these, switching on **Notebook access** for each:
   - `CDSAPI_URL` = `https://cds.climate.copernicus.eu/api`
   - `CDSAPI_KEY` = your CDS token
   - `EARTHDATA_USERNAME` = your Earthdata username
   - `EARTHDATA_PASSWORD` = your Earthdata password
4. Never type keys into a notebook cell, and never use *File → Save a copy in GitHub*.

## Part F — Where your credentials are kept, and how they are protected

**Two copies, both outside every repo:**

| Copy | Where | Used by |
|---|---|---|
| Working files | `C:\Users\sislam27\.cdsapirc`, `_netrc` and `.netrc` (and `.copernicusmarine\` if Part C is done) | the download libraries (cdsapi, earthaccess, copernicusmarine) |
| Encrypted vault | Windows **Credential Manager**, entries named `aofd`, encrypted with your Windows login | `tools\secrets_vault.py`: values for Colab, and rebuilding the files on a new laptop |

`tools\setup_credentials.py` updates both copies at once, so after a password change you only rerun it.

| Task | Command (inside `AOFD Vallis`) |
|---|---|
| See which entries are stored (no values shown) | `.venv\Scripts\python.exe tools\secrets_vault.py list` |
| Show the values for Colab Secrets | `.venv\Scripts\python.exe tools\secrets_vault.py colab` |
| Recreate the working files from the vault | `.venv\Scripts\python.exe tools\secrets_vault.py restore` |
| Look at the vault by hand | Control Panel → **Credential Manager** → **Windows Credentials** → entries starting with `aofd` |

**What stops a credential from reaching GitHub (both repos, fluidpy and aofd):**

1. `.gitignore` ignores `.cdsapirc`, netrc files, `.env`, credential and secret files, key files, and any image or
   PDF dropped in the repo root (screenshots).
2. A **pre-commit hook** runs `tools\check_secrets.py --staged` and blocks the commit if any added line contains:
   - one of *your real* tokens or passwords (read from the files above at run time, never stored in the repo);
   - a `key:` token, a `machine … password …` line or a `password = …` value;
   - a GitHub, AWS or Google key, or a private key.

   It also blocks credential files and root screenshots.
3. A **pre-push hook** runs the same scan over every commit being pushed. Even a commit made with `--no-verify` is
   stopped before it leaves the laptop.
4. Claude never writes credential values into notebooks, reports or its memory files. Memory records only *where*
   they are kept.

Screenshots of login pages are the most common leak, so delete each one once its account is set up.
