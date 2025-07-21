# Manual Security Testing Guide

## 🚨 Quick Start Testing

### 1. Browser Console Testing

Open your browser's developer console (F12) and test the sanitization functions directly:

```javascript
// Test XSS in task description
try {
  const result = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      description: "<script>alert('XSS')</script>",
      priority: "high",
      projectId: "550e8400-e29b-41d4-a716-446655440000",
    }),
  });
  console.log("❌ XSS not blocked:", await result.json());
} catch (error) {
  console.log("✅ XSS blocked:", error.message);
}

// Test SQL injection in search
try {
  const response = await fetch("/api/search?q='; DROP TABLE task; --");
  console.log("❌ SQL injection not blocked");
} catch (error) {
  console.log("✅ SQL injection blocked:", error.message);
}
```

### 2. Form Testing

#### Sign Up Form

1. Try weak passwords: `password123`, `123456`, `admin`
2. Try XSS in name: `<script>alert('XSS')</script>`
3. Try invalid emails: `not-an-email`, `test@`

#### Task Creation Form

1. Try XSS in description: `<img src=x onerror=alert('XSS')>`
2. Try SQL injection: `'; DROP TABLE task; --`
3. Try extremely long text (1000+ characters)

#### Search Form

1. Try: `<script>alert('XSS')</script>`
2. Try: `'; SELECT * FROM users; --`
3. Try: `javascript:alert('XSS')`

### 3. URL Parameter Testing

Test these URLs directly in your browser:

```
# XSS in search parameter
http://localhost:3000/search?q=<script>alert('XSS')</script>

# SQL injection in ID parameter
http://localhost:3000/tasks/'; DROP TABLE task; --

# Invalid UUID
http://localhost:3000/projects/not-a-uuid
```

## 🔧 Tools for Testing

### curl Commands

```bash
# Test XSS in task creation
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"description":"<script>alert(\"XSS\")</script>","priority":"high"}'

# Test SQL injection in search
curl -X GET "http://localhost:3000/api/search?q=%27%3B%20DROP%20TABLE%20task%3B%20--"

# Test weak password
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123","name":"Test","lastName":"User"}'
```

### Postman/Insomnia Collection

Create requests with these payloads:

1. **POST /api/auth/signup**

   ```json
   {
     "name": "<script>alert('XSS')</script>",
     "lastName": "Doe",
     "email": "test@example.com",
     "password": "password123"
   }
   ```

2. **POST /api/tasks**
   ```json
   {
     "description": "'; DROP TABLE task; --",
     "priority": "<script>alert('XSS')</script>",
     "projectId": "not-a-uuid"
   }
   ```

## ✅ Expected Results

When testing, you should see:

### ✅ GOOD (Security Working)

- Error messages like "Invalid input format"
- Inputs being sanitized (HTML tags removed)
- Invalid UUIDs being rejected
- Weak passwords being rejected
- XSS payloads being stripped

### ❌ BAD (Security Issues)

- XSS scripts executing in browser
- Raw HTML rendering in UI
- SQL errors in console/logs
- Malicious inputs being stored as-is
- No validation error messages

## 🎯 Critical Test Cases

**MUST BLOCK:**

1. `<script>alert('XSS')</script>` in any text field
2. `'; DROP TABLE task; --` in any input
3. Password `123456` or `password`
4. Email `not-an-email`
5. UUID `'; DROP TABLE users; --`

**SHOULD SANITIZE:**

1. `<b>Bold text</b>` → `Bold text`
2. `John's Task` → `John's Task` (preserve apostrophes)
3. `High` priority → `high` (normalize case)

## 📊 Testing Checklist

- [ ] XSS blocked in task descriptions
- [ ] XSS blocked in user names
- [ ] XSS blocked in project names
- [ ] XSS blocked in search queries
- [ ] SQL injection blocked in all inputs
- [ ] Weak passwords rejected
- [ ] Invalid emails rejected
- [ ] Invalid UUIDs rejected
- [ ] Length limits enforced
- [ ] HTML tags stripped from text
- [ ] Special characters escaped
- [ ] Invalid dates rejected
- [ ] Invalid times rejected

## 🚨 If You Find Issues

1. **Document the payload** that bypassed security
2. **Note which field** allowed the malicious input
3. **Check the browser console** for errors
4. **Review the network tab** to see what was sent to server
5. **Test variations** of the successful payload

## 📝 Testing Log Template

```
Date: ___________
Tester: _________

Test: XSS in task description
Payload: <script>alert('XSS')</script>
Result: [ ] Blocked [ ] Allowed
Notes: ________________________________

Test: SQL injection in search
Payload: '; DROP TABLE task; --
Result: [ ] Blocked [ ] Allowed
Notes: ________________________________

Test: Weak password
Payload: password123
Result: [ ] Blocked [ ] Allowed
Notes: ________________________________
```

## 🎉 Success Criteria

Your application is secure when:

- **100% of XSS attempts are blocked**
- **100% of SQL injection attempts are blocked**
- **All weak passwords are rejected**
- **All invalid formats are rejected**
- **User-friendly error messages are shown**
- **No malicious content reaches the database**
