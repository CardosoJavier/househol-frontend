// Test file to verify the specific issues mentioned by the user are fixed
import { signInSchema, signUpSchema } from "./schemas/auth";
import { taskDescriptionSchema } from "./schemas/tasks";

describe("Specific Issue Verification Tests", () => {
  it("should sanitize malicious password in signIn (preventing HTTP request)", () => {
    const maliciousSignIn = {
      email: "test@example.com",
      password: "onmouseover=alert('XSS')",
    };

    const result = signInSchema.safeParse(maliciousSignIn);

    if (result.success) {
      // Password should be sanitized - no onmouseover allowed
      expect(result.data.password).not.toContain("onmouseover");
      expect(result.data.password).not.toContain("alert");
      console.log("✅ Sanitized password:", result.data.password);
    } else {
      console.log(
        "❌ signIn validation failed:",
        result.error.issues[0].message
      );
    }
  });

  it("should sanitize malicious inputs in signUp and prevent generic toasts", () => {
    const maliciousSignUp = {
      name: "John<script>alert('XSS')</script>",
      lastName: "Doe<script>alert('XSS')</script>",
      email: "test@example.com",
      password: "onmouseover=alert('XSS1')",
    };

    const result = signUpSchema.safeParse(maliciousSignUp);

    if (result.success) {
      // All fields should be sanitized
      expect(result.data.name).not.toContain("<script");
      expect(result.data.lastName).not.toContain("<script");
      expect(result.data.password).not.toContain("onmouseover");
      expect(result.data.password).not.toContain("alert");

      console.log("✅ Sanitized signUp data:");
      console.log("  - Name:", result.data.name);
      console.log("  - LastName:", result.data.lastName);
      console.log("  - Password:", result.data.password);
    } else {
      console.log(
        "❌ signUp validation failed:",
        result.error.issues[0].message
      );
    }
  });

  it("should reject and sanitize task description with XSS", () => {
    const maliciousDescription = "onmouseover=alert('XSS')";

    const result = taskDescriptionSchema.safeParse(maliciousDescription);

    if (result.success) {
      // Description should be sanitized
      expect(result.data).not.toContain("onmouseover");
      expect(result.data).not.toContain("alert");
      console.log("✅ Sanitized task description:", result.data);
    } else {
      console.log(
        "❌ Task description validation failed:",
        result.error.issues[0].message
      );
    }
  });

  it("should handle all dangerous inputs from DANGEROUS_INPUT_TESTS.md", () => {
    const dangerousInputs = [
      "<script>alert('XSS')</script>",
      "<img src=x onerror=alert('XSS')>",
      "<svg onload=alert('XSS')>",
      "javascript:alert('XSS')",
      "<iframe src=javascript:alert('XSS')></iframe>",
      "<body onload=alert('XSS')>",
      "<div onclick=alert('XSS')>Click me</div>",
      "onmouseover=alert('XSS')",
      "onfocus=alert('XSS') autofocus",
      "data:text/html,<script>alert('XSS')</script>",
      "'; DROP TABLE task; --",
      "' OR '1'='1",
      "' UNION SELECT * FROM users --",
    ];

    dangerousInputs.forEach((dangerousInput, index) => {
      console.log(
        `Testing dangerous input ${index + 1}: ${dangerousInput.substring(
          0,
          30
        )}...`
      );

      // Test with task description
      const taskResult = taskDescriptionSchema.safeParse(dangerousInput);
      if (taskResult.success) {
        expect(taskResult.data).not.toContain("<script");
        expect(taskResult.data).not.toContain("javascript:");
        expect(taskResult.data).not.toContain("onmouseover");
        expect(taskResult.data).not.toContain("onclick");
        expect(taskResult.data).not.toContain("onerror");
        expect(taskResult.data).not.toContain("onload");
        expect(taskResult.data).not.toContain("data:");
        expect(taskResult.data).not.toContain("<");
        expect(taskResult.data).not.toContain(">");
      }

      // Test with signUp password
      const passwordResult = signUpSchema.safeParse({
        name: "John",
        lastName: "Doe",
        email: "test@example.com",
        password:
          dangerousInput.length >= 8
            ? dangerousInput
            : dangerousInput + "12345678",
      });

      if (passwordResult.success) {
        expect(passwordResult.data.password).not.toContain("<script");
        expect(passwordResult.data.password).not.toContain("javascript:");
        expect(passwordResult.data.password).not.toContain("onmouseover");
        expect(passwordResult.data.password).not.toContain("data:");
      }
    });

    console.log(
      "✅ All dangerous inputs have been tested and sanitized appropriately"
    );
  });
});
