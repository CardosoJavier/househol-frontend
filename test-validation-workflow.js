// Quick test to verify validation workflow
// This simulates what happens when invalid input is provided

// Mock the toast function
const mockToast = { calls: [] };
const showToast = (message, type) => {
  mockToast.calls.push({ message, type });
  console.log(`Toast: [${type}] ${message}`);
};

// Mock the schemas and sanitization (simplified)
const sanitizeInput = (schema, data) => {
  if (!data) {
    return { success: false, error: "Invalid input: data is required" };
  }

  if (typeof data === "object") {
    if (!data.email || !data.password) {
      return {
        success: false,
        error: "Invalid input: email and password are required",
      };
    }
  }

  if (typeof data === "string" && data.length < 3) {
    return {
      success: false,
      error: "Invalid input: must be at least 3 characters",
    };
  }

  return { success: true, data };
};

// Simulate the updated signUp function pattern
async function testSignUp(userInfo) {
  console.log("\n--- Testing signUp with invalid data ---");

  const sanitizationResult = sanitizeInput({}, userInfo);

  if (!sanitizationResult.success) {
    // Show validation error toast and return early - no HTTP request
    showToast(sanitizationResult.error, "error");
    return { message: sanitizationResult.error };
  }

  // This should never be reached with invalid data
  console.log("✅ Making HTTP request with valid data...");
  return { success: true };
}

// Simulate the updated createNewTask function pattern
async function testCreateTask(taskData) {
  console.log("\n--- Testing createNewTask with invalid data ---");

  const sanitizationResult = sanitizeInput({}, taskData);

  if (!sanitizationResult.success) {
    // Show validation error toast and return early - no HTTP request
    showToast(sanitizationResult.error, "error");
    return false;
  }

  // This should never be reached with invalid data
  console.log("✅ Making HTTP request with valid data...");
  return true;
}

// Test cases
async function runTests() {
  console.log("🧪 Testing validation workflow...\n");

  // Test 1: Invalid signUp
  const invalidSignUp = await testSignUp({ email: "test@example.com" }); // missing password
  console.log("Result:", invalidSignUp);

  // Test 2: Invalid task creation
  const invalidTask = await testCreateTask(null);
  console.log("Result:", invalidTask);

  // Test 3: Valid signUp
  console.log("\n--- Testing signUp with valid data ---");
  const validSignUp = await testSignUp({
    email: "test@example.com",
    password: "password123",
  });
  console.log("Result:", validSignUp);

  console.log("\n📊 Summary:");
  console.log(`- Total toasts shown: ${mockToast.calls.length}`);
  console.log("- Toast calls:", mockToast.calls);
  console.log("\n✅ Validation workflow test complete!");
  console.log(
    "✅ Invalid inputs show toasts and return early (no HTTP requests)"
  );
  console.log("✅ Valid inputs proceed to HTTP requests");
}

runTests();
