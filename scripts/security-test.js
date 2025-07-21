#!/usr/bin/env node

/**
 * Security Test Script for ChoreBoard Input Sanitization
 *
 * This script tests various malicious inputs against your Zod schemas
 * to verify that input sanitization is working correctly.
 *
 * Usage: node security-test.js
 */

import { z } from "zod";

// Import your schemas (adjust paths as needed)
import {
  signUpSchema,
  signInSchema,
  createTaskSchema,
  createProjectSchema,
  searchQuerySchema,
} from "../src/schemas/index.js";

import { sanitizeInput, sanitizeHtml } from "../src/utils/inputSanitization.js";

// Test cases
const XSS_PAYLOADS = [
  "<script>alert('XSS')</script>",
  "<img src=x onerror=alert('XSS')>",
  "<svg onload=alert('XSS')>",
  "javascript:alert('XSS')",
  "<iframe src=javascript:alert('XSS')></iframe>",
  "<body onload=alert('XSS')>",
  "onmouseover=alert('XSS')",
  "<SCR\0IPT>alert('XSS')</SCR\0IPT>",
];

const SQL_INJECTION_PAYLOADS = [
  "'; DROP TABLE task; --",
  "' OR '1'='1",
  "' UNION SELECT * FROM users --",
  "'; DELETE FROM projects WHERE '1'='1'; --",
  "1; DROP TABLE task; --",
  "' OR 1=1 --",
];

const WEAK_PASSWORDS = [
  "123",
  "password",
  "password123",
  "123456789",
  "qwerty123",
  "admin123",
  "alllowercase",
  "ALLUPPERCASE",
  "12345678",
];

const MALICIOUS_EMAILS = [
  "test+<script>alert('XSS')</script>@example.com",
  "<script>alert('XSS')</script>@example.com",
  "test'; DROP TABLE users; --@example.com",
  "admin'--@example.com",
  "not-an-email",
  "@example.com",
  "test@",
];

// Test runner functions
function testSchema(schemaName, schema, testCases, validInput = {}) {
  console.log(`\n🧪 Testing ${schemaName}:`);
  console.log("=" + "=".repeat(schemaName.length + 10));

  let blocked = 0;
  let total = testCases.length;

  testCases.forEach((testCase, index) => {
    try {
      const testInput =
        typeof testCase === "string"
          ? { ...validInput, [Object.keys(validInput)[0] || "input"]: testCase }
          : testCase;

      const result = sanitizeInput(schema, testInput);

      if (!result.success) {
        console.log(`✅ Test ${index + 1}: BLOCKED - ${testCase}`);
        console.log(`   Error: ${result.error}`);
        blocked++;
      } else {
        console.log(`❌ Test ${index + 1}: ALLOWED - ${testCase}`);
        console.log(`   Sanitized: ${JSON.stringify(result.data)}`);
      }
    } catch (error) {
      console.log(`✅ Test ${index + 1}: BLOCKED (Exception) - ${testCase}`);
      console.log(`   Error: ${error.message}`);
      blocked++;
    }
  });

  console.log(
    `\n📊 Results: ${blocked}/${total} malicious inputs blocked (${Math.round(
      (blocked / total) * 100
    )}%)`
  );
  return { blocked, total };
}

function testHtmlSanitization() {
  console.log(`\n🧪 Testing HTML Sanitization:`);
  console.log("===============================");

  XSS_PAYLOADS.forEach((payload, index) => {
    const sanitized = sanitizeHtml(payload);
    const isClean =
      !sanitized.includes("<") && !sanitized.includes("javascript:");

    console.log(`Test ${index + 1}: ${isClean ? "✅" : "❌"}`);
    console.log(`  Input:  ${payload}`);
    console.log(`  Output: ${sanitized}`);
    console.log();
  });
}

// Main test execution
async function runSecurityTests() {
  console.log("🔒 ChoreBoard Security Test Suite");
  console.log("==================================");
  console.log("Testing input sanitization against malicious payloads...\n");

  let totalBlocked = 0;
  let totalTests = 0;

  // Test Sign Up with XSS in names
  const signUpResults = testSchema(
    "Sign Up (XSS in names)",
    signUpSchema,
    XSS_PAYLOADS.map((payload) => ({
      name: payload,
      lastName: "Doe",
      email: "test@example.com",
      password: "StrongP@ss123",
    }))
  );
  totalBlocked += signUpResults.blocked;
  totalTests += signUpResults.total;

  // Test Sign Up with weak passwords
  const passwordResults = testSchema(
    "Sign Up (Weak passwords)",
    signUpSchema,
    WEAK_PASSWORDS.map((password) => ({
      name: "John",
      lastName: "Doe",
      email: "test@example.com",
      password,
    }))
  );
  totalBlocked += passwordResults.blocked;
  totalTests += passwordResults.total;

  // Test Sign In with malicious emails
  const emailResults = testSchema(
    "Sign In (Malicious emails)",
    signInSchema,
    MALICIOUS_EMAILS.map((email) => ({
      email,
      password: "password123",
    }))
  );
  totalBlocked += emailResults.blocked;
  totalTests += emailResults.total;

  // Test Task Creation with XSS
  const taskResults = testSchema(
    "Task Creation (XSS in description)",
    createTaskSchema,
    XSS_PAYLOADS.map((payload) => ({
      description: payload,
      priority: "high",
      projectId: "550e8400-e29b-41d4-a716-446655440000",
    }))
  );
  totalBlocked += taskResults.blocked;
  totalTests += taskResults.total;

  // Test Project Creation with SQL Injection
  const projectResults = testSchema(
    "Project Creation (SQL Injection)",
    createProjectSchema,
    SQL_INJECTION_PAYLOADS.map((payload) => ({
      name: payload,
    }))
  );
  totalBlocked += projectResults.blocked;
  totalTests += projectResults.total;

  // Test Search Sanitization
  const searchResults = testSchema(
    "Search (Combined attacks)",
    z.object({ search: searchQuerySchema }),
    [...XSS_PAYLOADS, ...SQL_INJECTION_PAYLOADS].map((payload) => ({
      search: payload,
    }))
  );
  totalBlocked += searchResults.blocked;
  totalTests += searchResults.total;

  // Test HTML Sanitization directly
  testHtmlSanitization();

  // Final summary
  console.log("\n" + "=".repeat(50));
  console.log("🎯 FINAL SECURITY TEST RESULTS");
  console.log("=".repeat(50));
  console.log(`Total malicious inputs tested: ${totalTests}`);
  console.log(`Total malicious inputs blocked: ${totalBlocked}`);
  console.log(
    `Security effectiveness: ${Math.round((totalBlocked / totalTests) * 100)}%`
  );

  if (totalBlocked === totalTests) {
    console.log("🎉 EXCELLENT: All malicious inputs were blocked!");
  } else if (totalBlocked / totalTests >= 0.9) {
    console.log("✅ GOOD: Most malicious inputs were blocked.");
  } else {
    console.log("⚠️  WARNING: Some malicious inputs were not blocked!");
  }

  // Recommendations
  console.log("\n📋 RECOMMENDATIONS:");
  if (totalBlocked < totalTests) {
    console.log("- Review and strengthen input validation schemas");
    console.log("- Add additional sanitization for unblocked inputs");
    console.log("- Consider implementing CSP headers");
  }
  console.log("- Regularly test with updated attack vectors");
  console.log("- Monitor application logs for attack attempts");
  console.log("- Keep dependencies updated for security patches");
}

// Handle different module systems
if (import.meta.url === `file://${process.argv[1]}`) {
  runSecurityTests().catch(console.error);
}

export { runSecurityTests };
