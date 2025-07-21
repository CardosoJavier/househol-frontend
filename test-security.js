const { z } = require("zod");

// Test malicious input rejection (simulating our schema logic)
const testSchema = z
  .string()
  .trim()
  .min(1, "Description is required")
  .max(500, "Description cannot exceed 500 characters")
  .refine((description) => {
    const maliciousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /<[^>]*>/g,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /data:/gi,
      /alert\s*\(/gi,
      /eval\s*\(/gi,
      /['"`;\\]/g,
      /--/g,
      /\/\*/g,
      /\*\//g,
      /\b(DROP|DELETE|INSERT|UPDATE|UNION|SELECT|EXEC|EXECUTE|TRUNCATE|ALTER|CREATE)\b/gi,
    ];

    return !maliciousPatterns.some((pattern) => pattern.test(description));
  }, "Input contains invalid characters or patterns. Please use only alphanumeric characters, spaces, and basic punctuation.");

console.log("Testing security rejection patterns...\n");

const maliciousInputs = [
  '<script>alert("hack")</script>',
  " ",
  '<img onerror="alert(1)" src=x>',
  "data:text/html,<script>alert(1)</script>",
  "DROP TABLE users;",
  "'; DELETE FROM users; --",
  "/* malicious comment */ DELETE",
  'eval("malicious code")',
];

const safeInputs = [
  "Complete the project documentation",
  "Review code changes and merge PR",
  "Update user interface components",
  "Fix bug in authentication flow",
];

maliciousInputs.forEach((input, index) => {
  try {
    const result = testSchema.parse(input);
    console.log(
      `❌ SECURITY ISSUE ${index + 1}: Malicious input was accepted:`,
      input
    );
  } catch (error) {
    console.log(
      `✅ SECURITY WORKING ${index + 1}: Malicious input rejected:`,
      input.substring(0, 50) + (input.length > 50 ? "..." : "")
    );
  }
});

console.log("\nTesting safe inputs...\n");

safeInputs.forEach((input, index) => {
  try {
    const result = testSchema.parse(input);
    console.log(`✅ SAFE INPUT ${index + 1}: Accepted:`, input);
  } catch (error) {
    console.log(`❌ FALSE POSITIVE ${index + 1}: Safe input rejected:`, input);
  }
});
