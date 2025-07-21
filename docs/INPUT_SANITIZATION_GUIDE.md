# Input Sanitization Implementation Guide

This document outlines the comprehensive input sanitization system implemented using Zod for the ChoreBoard application.

## Overview

All user inputs in the application are now sanitized and validated using Zod schemas to prevent:

- XSS attacks
- SQL injection
- Data validation issues
- Malformed input submission

## Implementation

### 1. Schemas

#### Authentication Schemas (`src/schemas/auth.ts`)

- **`signInSchema`**: Validates email and password for login
- **`signUpSchema`**: Validates registration data (name, lastName, email, password)
- **`emailSchema`**: Validates and normalizes email addresses
- **`nameSchema`**: Validates names with proper sanitization

#### Task Schemas (`src/schemas/tasks.ts`)

- **`createTaskSchema`**: Validates new task creation
- **`updateTaskSchema`**: Validates task updates
- **`taskDescriptionSchema`**: Sanitizes task descriptions (removes HTML)
- **`taskPrioritySchema`**: Validates task priority levels
- **`taskStatusSchema`**: Validates task status values

#### Project Schemas (`src/schemas/projects.ts`)

- **`createProjectSchema`**: Validates project creation
- **`updateProjectSchema`**: Validates project updates
- **`projectNameSchema`**: Sanitizes project names

#### Column Schemas (`src/schemas/columns.ts`)

- **`createColumnSchema`**: Validates column creation
- **`updateColumnSchema`**: Validates column updates
- **`columnTitleSchema`**: Sanitizes column titles

#### User Profile Schemas (`src/schemas/user.ts`)

- **`updateProfileSchema`**: Validates profile updates
- **`changePasswordSchema`**: Validates password changes

#### Search & Filter Schemas (`src/schemas/search.ts`)

- **`searchQuerySchema`**: Sanitizes search queries
- **`taskFilterSchema`**: Validates task filtering parameters
- **`projectFilterSchema`**: Validates project filtering parameters

### 2. Utility Functions

#### `sanitizeInput<T>(schema, input)`

Synchronous validation and sanitization:

```typescript
import { sanitizeInput, signInSchema } from "../schemas";

const result = sanitizeInput(signInSchema, { email, password });
if (!result.success) {
  throw new Error(result.error);
}
const { email: sanitizedEmail, password: sanitizedPassword } = result.data;
```

#### `sanitizeInputAsync<T>(schema, input)`

Asynchronous validation and sanitization for complex validations.

#### `sanitizeHtml(input)`

Removes HTML tags and prevents XSS attacks:

```typescript
const cleanString = sanitizeHtml(userInput);
```

#### `sanitizeObject(obj)`

Recursively sanitizes object properties:

```typescript
const cleanObject = sanitizeObject(formData);
```

### 3. API Integration

All API functions now include input sanitization:

#### Authentication

- `signIn()` - Validates email and password
- `signUp()` - Validates all registration fields

#### Tasks

- `createNewTask()` - Validates task creation data
- `updateTaskById()` - Validates task update data
- `deleteTaskById()` - Validates task ID

#### Projects

- `createNewProject()` - Validates project name
- `getColumnsByProjectId()` - Validates project ID

#### Columns

- `createStatusColumn()` - Validates column data

## Security Features

### 1. Input Validation

- **Length limits**: Prevents buffer overflow attacks
- **Format validation**: Ensures data meets expected formats
- **Pattern matching**: Uses regex to validate specific patterns

### 2. HTML Sanitization

- **Script tag removal**: Prevents XSS attacks
- **Event handler removal**: Removes onclick, onload, etc.
- **Protocol filtering**: Removes javascript: protocols

### 3. SQL Injection Prevention

- **Special character escaping**: Removes dangerous SQL characters
- **Parameter validation**: Ensures IDs are valid UUIDs

### 4. Password Security

- **Strength requirements**: Enforces complex passwords
- **Common pattern detection**: Prevents weak passwords
- **Length limits**: Prevents extremely long inputs

## Usage Examples

### Frontend Form Validation

```typescript
import { sanitizeInput, createTaskSchema } from "../schemas";

const handleSubmit = (formData) => {
  const result = sanitizeInput(createTaskSchema, formData);
  if (!result.success) {
    setError(result.error);
    return;
  }

  // Use sanitized data
  await createNewTask(result.data);
};
```

### API Function Usage

```typescript
// The API functions automatically sanitize inputs
try {
  await createNewTask({
    description: userInput.description, // Will be sanitized
    priority: userInput.priority, // Will be validated
    projectId: userInput.projectId, // Will be validated as UUID
  });
} catch (error) {
  // Handle validation errors
  console.error("Validation failed:", error.message);
}
```

## Best Practices

1. **Always validate at the API layer**: Even if frontend validates, backend must validate
2. **Use specific schemas**: Don't reuse generic schemas for different purposes
3. **Sanitize early**: Validate input as soon as it enters the system
4. **Log validation failures**: Monitor for potential attacks
5. **Use TypeScript types**: Leverage generated types from schemas

## Error Handling

Validation errors provide user-friendly messages:

```typescript
// Example error messages
"Email is required";
"Password must contain at least one uppercase letter";
"Task description cannot exceed 500 characters";
"Invalid project ID format";
```

## Testing

All schemas include comprehensive test coverage for:

- Valid inputs
- Invalid inputs
- Edge cases
- Security attack vectors

## Migration Notes

When adding new inputs:

1. Create appropriate Zod schema
2. Add to schemas index file
3. Update API function to use sanitization
4. Add TypeScript types
5. Update frontend to use new types
6. Add tests for new validation rules

This implementation ensures all user inputs are properly validated and sanitized, significantly improving the application's security posture.
