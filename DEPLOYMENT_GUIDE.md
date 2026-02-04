# Deployment Guide: Namecheap cPanel (Python App)

This guide walks you through deploying your Django + React (Inertia) app to Namecheap cPanel using the **Git Version Control** feature.

## Prerequisites

1.  **Namecheap cPanel Access**.
2.  **SSH Access** enabled in cPanel (Terminal).
3.  **Git Repository**: Your code must be pushed to a remote repository (GitHub, GitLab, etc.) that you can access.

---

## Phase 1: Prepare Your Project Locally

1.  **Check Requirements**: Ensure `whitenoise` is in your `requirements.txt`.
2.  **Build Frontend**:
    - Run `npm run build` locally.
    - _Crucial_: This creates the `static/dist` folder with your JS/CSS.
3.  **Push Changes**:
    - Ensure `static/dist` is committed (I updated `.gitignore` to allow this).
    ```bash
    git add .
    git commit -m "Prepare for deployment with built assets"
    git push origin main
    ```

---

## Phase 2: Create the Database

1.  Log in to **cPanel**.
2.  Go to **MySQL Database Wizard**.
3.  **Step 1: Create A Database**:
    - Enter a confirmed name (e.g., `wetende_crossview`).
    - Click **Next Step**.
    - _Write down this database name._
4.  **Step 2: Create Database Users**:
    - Username: `wetende_user` (example).
    - Password: Generate a path strong password.
    - Click **Create User**.
    - _Write down the username and password._
5.  **Step 3: Add User to Database**:
    - Check **ALL PRIVILEGES**.
    - Click **Make Changes**.

---

## Phase 3: cPanel Setup (Python App)

1.  Log in to **cPanel**.
2.  Go to **Setup Python App**.
3.  Click **Create Application**.
    - **Python Version**: Select **3.9** or newer (match your local version if possible).
    - **Application Root**: `crossview` (This is the folder where code will live).
    - **Application URL**: Select your domain (e.g., `wetende.com`).
    - **Application Startup File**: `passenger_wsgi.py` (leave as default for now).
    - **Application Entry Point**: `application` (leave as default).
4.  Click **Create**.
5.  **Copy the activation command** shown at the top (e.g., `source /home/user/virtualenv/crossview/3.9/bin/activate`). You will need this.

---

## Phase 4: Get Your Code (via Git)

1.  In cPanel, go to **Git Version Control**.
2.  Click **Create**.
    - **Clone URL**: Your repository URL (e.g., `https://github.com/wetende/crossview.git`).
    - **Repository Path**: `crossview` (IMPORTANT: This must match the **Application Root** you set in Python App).
        - _Note: If cPanel complains the directory is not empty, go to File Manager, navigate to `crossview`, and delete the default `passenger_wsgi.py` file created by the Python App tool._
3.  Click **Create** to clone your code.

---

## Phase 5: Configure the App

1.  Go to **File Manager** and navigate to the `crossview` folder.
2.  **Move the WSGI file**:
    - Move `deploy/passenger_wsgi.py` to the root folder (`crossview/passenger_wsgi.py`), replacing the default one if it exists.
    - _Why?_ The custom `passenger_wsgi.py` correctly points to `config.settings`.
3.  **Environment Variables**:
    - Create a new file named `.env` in the `crossview` folder.
    - Copy the contents from `deploy/.env.production` (or your local `.env`) into it.
    - **CRITICAL**: Update these values:
        - `DEBUG=False`
        - `ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com`
        - `DB_ENGINE=mysql`
        - `DB_NAME`, `DB_USER`, `DB_PASSWORD` (Create these in cPanel -> MySQL Database Wizard).
        - `STATIC_ROOT=/home/YOUR_USER/crossview/staticfiles` (Full path to static folder).

---

## Phase 6: Install Dependencies & Build

1.  Open **Terminal** in cPanel.
2.  Activate the virtual environment (paste the command you copied in Phase 3):
    ```bash
    source /home/username/virtualenv/crossview/3.9/bin/activate
    ```
3.  Navigate to your app folder:
    ```bash
    cd crossview
    ```
4.  Install Python dependencies:
    ```bash
    pip install --upgrade pip
    pip install -r requirements.txt
    ```
    _Note: We are using `pymysql` because `mysqlclient` requires compilation (GCC), which is restricted on this server._
5.  **Verify Frontend Assets**:
    - Ensure `static/dist` exists.
    - _If missing_: You skipped Phase 1. You must build locally and push, then run `git pull` here.

6.  Collect Static Files:

    ```bash
    python manage.py collectstatic
    ```

7.  Run Migrations:
    ```bash
    python manage.py migrate
    ```

---

## Phase 7: Finalize

1.  Go back to **Setup Python App** in cPanel.
2.  Click **Restart** on your application.
3.  Visit your website.

---

## Troubleshooting

- **500 Error?** Check the errors log in cPanel (`error_log` file often appears in the app root).
- **Static files missing?** Ensure `whitenoise` is installed and `DEBUG=False` is set in `.env`.
- **Database Error?** Check your `.env` database credentials.
