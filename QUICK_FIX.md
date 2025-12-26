# Quick Fix: MySQL Password Error

## The Problem

You're seeing: `Access denied for user 'root'@'localhost' (using password: YES)`

This means the password in `backend/.env` doesn't match your MySQL password.

## The Solution

### Step 1: Edit backend/.env

```bash
cd backend
nano .env
# or open in your editor
code .env
```

### Step 2: Update DB_PASSWORD

**If MySQL has NO password** (common on fresh installs):
```env
DB_PASSWORD=
```

**If MySQL HAS a password** (the one you used when running `mysql -u root -p`):
```env
DB_PASSWORD=the_password_you_entered
```

### Step 3: Save and Restart

```bash
cd ..
npm run dev
```

## Quick Test

Test if your MySQL password works:
```bash
mysql -u root -p
# Enter password - if it works, use that same password in .env
```

## Complete .env Example

Your `backend/.env` should look like:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=              # Leave empty if no password, or enter your MySQL password
DB_NAME=tree_suites_db
DB_PORT=3306
PORT=3000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
```

That's it! Once the password is correct, everything should work. 🎉

