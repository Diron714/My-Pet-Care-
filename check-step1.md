# Step 1 Verification Guide

## How to Check if Step 1 (Database Setup) is Complete

### Method 1: Using MySQL Command Line

1. **Open Command Prompt or PowerShell**

2. **Connect to MySQL:**
   ```bash
   mysql -u root -p
   ```
   Enter your MySQL password when prompted.

3. **Check if database exists:**
   ```sql
   SHOW DATABASES LIKE 'mypetcare_db';
   ```
   
   **Expected:** Should show `mypetcare_db` in the list

4. **Use the database:**
   ```sql
   USE mypetcare_db;
   ```

5. **Count tables:**
   ```sql
   SHOW TABLES;
   ```
   
   **Expected:** Should list 30 tables

6. **Verify table count:**
   ```sql
   SELECT COUNT(*) as table_count 
   FROM information_schema.tables 
   WHERE table_schema = 'mypetcare_db';
   ```
   
   **Expected:** Should return `30`

7. **Exit MySQL:**
   ```sql
   exit;
   ```

### Method 2: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your server
3. In the left panel, look for `mypetcare_db`
4. Click on it to expand
5. Count the tables - should be **30**

### Method 3: Using phpMyAdmin

1. Open phpMyAdmin
2. Look in the left sidebar for `mypetcare_db`
3. Click on it
4. Check the table count at the top - should show **30 tables**

---

## ✅ Step 1 Complete Checklist

- [ ] Database `mypetcare_db` exists
- [ ] Database contains exactly **30 tables**
- [ ] Key tables exist:
  - [ ] users
  - [ ] customers
  - [ ] doctors
  - [ ] pets
  - [ ] products
  - [ ] orders
  - [ ] appointments

---

## ❌ If Database Doesn't Exist

**Run this command:**
```bash
mysql -u root -p < "C:\Users\Diron\Desktop\My Pet Care+\database\schema.sql"
```

Or use MySQL Workbench:
1. File → Open SQL Script
2. Select: `database/schema.sql`
3. Click Execute

---

## ⚠️ If Tables Are Missing

If database exists but has fewer than 30 tables:
1. Drop the database: `DROP DATABASE mypetcare_db;`
2. Re-import schema.sql

---

## 🎯 Quick Verification Query

Run this in MySQL to get a complete status:

```sql
SELECT 
    CASE 
        WHEN COUNT(*) = 30 THEN '✅ COMPLETE - All 30 tables exist'
        WHEN COUNT(*) = 0 THEN '❌ NO TABLES - Import schema.sql'
        ELSE CONCAT('⚠️ INCOMPLETE - Only ', COUNT(*), ' tables found (expected 30)')
    END as status,
    COUNT(*) as table_count
FROM information_schema.tables 
WHERE table_schema = 'mypetcare_db';
```

---

**Once Step 1 is verified complete, proceed to Step 2: Install Backend Dependencies**

