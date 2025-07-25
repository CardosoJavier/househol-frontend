// Quick test for date validation
import { createTaskSchema } from "./src/schemas/tasks.js";

// Test with today's date
const today = new Date();
today.setHours(12, 0, 0, 0); // Set to noon to avoid any edge cases

const testTask = {
  description: "Test task",
  dueDate: today,
  priority: "high",
  type: "feature",
  projectId: "550e8400-e29b-41d4-a716-446655440000",
};

try {
  const result = createTaskSchema.parse(testTask);
  console.log("✅ Today's date validation PASSED:", today.toDateString());
  console.log("Parsed result:", {
    description: result.description,
    dueDate: result.dueDate.toDateString(),
    priority: result.priority,
    type: result.type,
  });
} catch (error) {
  console.log("❌ Today's date validation FAILED:", error.message);
}

// Test with yesterday (should fail)
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
yesterday.setHours(12, 0, 0, 0);

const testTaskYesterday = {
  description: "Test task",
  dueDate: yesterday,
  priority: "high",
  type: "feature",
  projectId: "550e8400-e29b-41d4-a716-446655440000",
};

try {
  const result = createTaskSchema.parse(testTaskYesterday);
  console.log("❌ Yesterday's date validation INCORRECTLY PASSED");
} catch (error) {
  console.log(
    "✅ Yesterday's date validation correctly FAILED:",
    error.message
  );
}
