# Centralized API Error Handling System

## Overview

This system provides consistent error handling, logging, and user feedback across all API operations in the ChoreBoard frontend application.

## Core Components

### 1. `apiWrapper<T>()` - Main API Wrapper

The primary function that wraps any Supabase operation to provide consistent error handling.

```typescript
import { apiWrapper } from "../api/apiWrapper";

const result = await apiWrapper(
  async () => {
    // Your Supabase operation here
    const { data, error } = await supabase.from("table").select();
    return { data, error };
  },
  {
    showSuccessToast: true,
    successMessage: "Data loaded successfully!",
    errorMessage: "Failed to load data",
    showErrorToast: true,
    logErrors: true,
  }
);

if (result.success) {
  console.log("Data:", result.data);
} else {
  console.log("Error:", result.error);
}
```

### 2. Configuration Options

```typescript
interface ApiOptions {
  showSuccessToast?: boolean; // Show success toast notification
  showErrorToast?: boolean; // Show error toast notification
  successMessage?: string; // Custom success message
  errorMessage?: string; // Custom error message
  logErrors?: boolean; // Log errors to console
}
```

### 3. Default Behavior

- ✅ **Error logging**: Enabled by default
- ✅ **Error toasts**: Enabled by default
- ❌ **Success toasts**: Disabled by default (prevent toast spam)
- 📝 **Generic messages**: Uses constants from `GENERIC_ERROR_MESSAGES`

## Usage Patterns

### Pattern 1: Simple Data Fetching

```typescript
export async function getUserProjects(): Promise<Project[] | null> {
  const result = await apiWrapper(
    async () => {
      const { data, error } = await supabase.from("projects").select("*");
      return { data, error };
    },
    {
      showErrorToast: false, // Don't spam users for background data fetching
      errorMessage: GENERIC_ERROR_MESSAGES.PROJECT_LOAD_FAILED,
    }
  );

  return result.success ? result.data : null;
}
```

### Pattern 2: User Actions (CRUD)

```typescript
export async function createProject(name: string): Promise<boolean> {
  const result = await apiWrapper(
    async () => {
      const { data, error } = await supabase
        .from("projects")
        .insert([{ name }]);
      return { data, error };
    },
    {
      showSuccessToast: true, // User should know their action succeeded
      showErrorToast: true, // User should know if it failed
      successMessage: GENERIC_SUCCESS_MESSAGES.PROJECT_CREATED,
      errorMessage: GENERIC_ERROR_MESSAGES.PROJECT_CREATE_FAILED,
    }
  );

  return result.success;
}
```

### Pattern 3: Authentication

```typescript
export async function signIn(email: string, password: string) {
  const result = await apiWrapper(
    async () => {
      const response = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data: response.data, error: response.error };
    },
    {
      showErrorToast: false, // Let the login form handle error display
      errorMessage: GENERIC_ERROR_MESSAGES.AUTH_SIGNIN_FAILED,
    }
  );

  // Return error for component to handle, or data on success
  return result.success ? result.data : result.error;
}
```

## Benefits

### 🔒 **Security**

- Prevents detailed error information from reaching users
- Logs full error details for developers
- Consistent error message format

### 🎯 **User Experience**

- Consistent error and success messaging
- No more `console.error` spam in production
- Better feedback for user actions

### 🛠 **Developer Experience**

- Single place to update error handling logic
- Consistent patterns across all API functions
- Easier debugging with centralized logging

### 📊 **Monitoring Ready**

- Easy to add error tracking (Sentry, LogRocket, etc.)
- Centralized logging for analytics
- Performance monitoring capabilities

## Migration Guide

### Before (Old Pattern):

```typescript
export async function oldFunction() {
  try {
    const { data, error } = await supabase.from("table").select();
    if (error) {
      console.error(error); // ❌ Exposes details
      return null;
    }
    return data;
  } catch (error) {
    console.error(error); // ❌ Inconsistent handling
    return null;
  }
}
```

### After (New Pattern):

```typescript
export async function newFunction() {
  const result = await apiWrapper(
    async () => {
      const { data, error } = await supabase.from("table").select();
      return { data, error };
    },
    {
      errorMessage: GENERIC_ERROR_MESSAGES.DATABASE_ERROR,
    }
  );

  return result.success ? result.data : null;
}
```

## Best Practices

1. **Use specific error messages** from `GENERIC_ERROR_MESSAGES` constants
2. **Don't show success toasts for background operations** (data fetching)
3. **Do show success toasts for user-initiated actions** (create, update, delete)
4. **Let components handle auth errors** (set `showErrorToast: false`)
5. **Always use the wrapper** for consistent behavior

## Future Enhancements

- 🔄 **Retry logic** for network failures
- 📈 **Performance monitoring** integration
- 🐛 **Error tracking service** integration (Sentry)
- 🔐 **Request/response logging** for audit trails
- ⚡ **Caching layer** for frequently accessed data
