# Awkaf Form Backend

This repository contains the backend for the Awkaf Form system built with Node.js and SQLite.

---

## 🚀 Branching & Deployment Policy

- The `master` branch is the **production** branch.
- The `master` branch is always **up-to-date with the production server**.
- Never push untested code to `master`.
- Always pull the latest changes before pushing.

---

## 🗄️ SQLite Database

- This project uses **SQLite** for data storage.
- The database file is named `database.db`.

### ⚠️ Do Not Commit the Database File

To avoid committing local data, make sure `database.db` is excluded:
