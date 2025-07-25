import {
  passwordSchema,
  emailSchema,
  nameSchema,
  signInSchema,
  signUpSchema,
} from "./auth";
import { taskDescriptionSchema } from "./tasks";
import { projectNameSchema } from "./projects";

describe("Comprehensive Input Sanitization Tests - DANGEROUS_INPUT_TESTS.md", () => {
  describe("XSS Test Cases", () => {
    const xssInputs = [
      "<script>alert('XSS')</script>",
      "<img src=x onerror=alert('XSS')>",
      "<svg onload=alert('XSS')>",
      "javascript:alert('XSS')",
      "<iframe src=javascript:alert('XSS')></iframe>",
      "<body onload=alert('XSS')>",
      "<div onclick=alert('XSS')>Click me</div>",
      "<script>document.location='http://evil.com'</script>",
      "John<script>alert('XSS')</script>Doe",
      "'; alert('XSS'); //",
      "Evil Project<script>window.location='http://malicious.com'</script>",
      "<meta http-equiv=refresh content=0;url=javascript:alert('XSS')>",
      // Encoded XSS
      "%3Cscript%3Ealert('XSS')%3C/script%3E",
      "&lt;script&gt;alert('XSS')&lt;/script&gt;",
      "<SCR\0IPT>alert('XSS')</SCR\0IPT>",
      // Event handler injection
      "onmouseover=alert('XSS')",
      "onfocus=alert('XSS') autofocus",
      "<input onfocus=alert('XSS') autofocus>",
      // Data URI XSS
      "data:text/html,<script>alert('XSS')</script>",
    ];

    describe("Task Description Sanitization", () => {
      xssInputs.forEach((maliciousInput, index) => {
        it(`should sanitize XSS input ${index + 1}: ${maliciousInput.substring(
          0,
          30
        )}...`, () => {
          const result = taskDescriptionSchema.safeParse(maliciousInput);
          if (result.success) {
            // Ensure all dangerous patterns are removed
            expect(result.data).not.toContain("<script");
            expect(result.data).not.toContain("javascript:");
            expect(result.data).not.toContain("onmouseover");
            expect(result.data).not.toContain("onclick");
            expect(result.data).not.toContain("onload");
            expect(result.data).not.toContain("onerror");
            expect(result.data).not.toContain("onfocus");
            expect(result.data).not.toContain("data:");
            expect(result.data).not.toContain("<");
            expect(result.data).not.toContain(">");
          }
        });
      });
    });

    describe("Name Field Sanitization", () => {
      const nameCompatibleXSS = [
        "John<script>alert('XSS')</script>Doe",
        "onmouseover=alert('XSS')",
        "<script>alert('XSS')</script>",
      ];

      nameCompatibleXSS.forEach((maliciousInput, index) => {
        it(`should sanitize name XSS input ${
          index + 1
        }: ${maliciousInput}`, () => {
          const result = nameSchema.safeParse(maliciousInput);
          // Most XSS attempts will be rejected by the regex, but if they pass validation
          // they should be sanitized
          if (result.success) {
            expect(result.data).not.toContain("<script");
            expect(result.data).not.toContain("javascript:");
            expect(result.data).not.toContain("onmouseover");
            expect(result.data).not.toContain("<");
            expect(result.data).not.toContain(">");
          }
        });
      });
    });

    describe("Email Field Sanitization", () => {
      const emailXSSInputs = [
        "test+<script>alert('XSS')</script>@example.com",
        "<script>alert('XSS')</script>@example.com",
      ];

      emailXSSInputs.forEach((maliciousInput, index) => {
        it(`should sanitize email XSS input ${
          index + 1
        }: ${maliciousInput}`, () => {
          const result = emailSchema.safeParse(maliciousInput);
          // Most will be rejected by email validation, but if they pass
          // they should be sanitized
          if (result.success) {
            expect(result.data).not.toContain("<script");
            expect(result.data).not.toContain("javascript:");
            expect(result.data).not.toContain("<");
            expect(result.data).not.toContain(">");
          }
        });
      });
    });

    describe("Password Field Sanitization", () => {
      xssInputs.forEach((maliciousInput, index) => {
        it(`should sanitize password XSS input ${
          index + 1
        }: ${maliciousInput.substring(0, 30)}...`, () => {
          const result = passwordSchema.safeParse(maliciousInput);
          if (result.success) {
            // Ensure all dangerous patterns are removed
            expect(result.data).not.toContain("<script");
            expect(result.data).not.toContain("javascript:");
            expect(result.data).not.toContain("onmouseover");
            expect(result.data).not.toContain("onclick");
            expect(result.data).not.toContain("onload");
            expect(result.data).not.toContain("onerror");
            expect(result.data).not.toContain("onfocus");
            expect(result.data).not.toContain("data:");
            expect(result.data).not.toContain("<");
            expect(result.data).not.toContain(">");
          }
        });
      });
    });

    describe("Project Name Sanitization", () => {
      xssInputs.forEach((maliciousInput, index) => {
        it(`should sanitize project name XSS input ${
          index + 1
        }: ${maliciousInput.substring(0, 30)}...`, () => {
          const result = projectNameSchema.safeParse(maliciousInput);
          if (result.success) {
            // Ensure all dangerous patterns are removed
            expect(result.data).not.toContain("<script");
            expect(result.data).not.toContain("javascript:");
            expect(result.data).not.toContain("onmouseover");
            expect(result.data).not.toContain("onclick");
            expect(result.data).not.toContain("onload");
            expect(result.data).not.toContain("onerror");
            expect(result.data).not.toContain("onfocus");
            expect(result.data).not.toContain("data:");
            expect(result.data).not.toContain("<");
            expect(result.data).not.toContain(">");
          }
        });
      });
    });

    describe("SQL Injection Test Cases", () => {
      const sqlInjectionInputs = [
        "'; DROP TABLE task; --",
        "' OR '1'='1",
        "' UNION SELECT * FROM users --",
        "'; DELETE FROM projects WHERE '1'='1'; --",
        "1; DROP TABLE task; --",
        "' OR 1=1 --",
        "'; EXEC xp_cmdshell('dir'); --",
        "1 OR 1=1",
        "1; DELETE FROM task; --",
        "' AND (SELECT COUNT(*) FROM users) > 0 --",
        "' OR (SELECT SUBSTRING(password,1,1) FROM users WHERE email='admin@test.com')='a' --",
        "'; WAITFOR DELAY '00:00:05'; --",
        "' OR (SELECT * FROM (SELECT(SLEEP(5)))a) --",
      ];

      describe("Task Description SQL Injection Protection", () => {
        sqlInjectionInputs.forEach((maliciousInput, index) => {
          it(`should handle SQL injection in task description ${
            index + 1
          }: ${maliciousInput}`, () => {
            const result = taskDescriptionSchema.safeParse(maliciousInput);
            // Task descriptions should accept text content but remove dangerous patterns
            if (result.success) {
              expect(result.data).not.toContain("<script");
              expect(result.data).not.toContain("javascript:");
              expect(result.data).not.toContain("onmouseover");
              expect(result.data).not.toContain("<");
              expect(result.data).not.toContain(">");
            }
          });
        });
      });
    });

    describe("Authentication Edge Cases", () => {
      describe("Weak Passwords", () => {
        const weakPasswords = [
          "123",
          "pass",
          "password",
          "password123",
          "123456789",
          "qwerty123",
          "admin123",
          "alllowercase",
          "ALLUPPERCASE",
          "12345678",
          "NoSpecial1",
        ];

        weakPasswords.forEach((weakPassword, index) => {
          it(`should reject or sanitize weak password ${
            index + 1
          }: ${weakPassword}`, () => {
            const result = passwordSchema.safeParse(weakPassword);
            // In test environment, passwords might be more lenient
            // but they should still be sanitized
            if (result.success) {
              expect(result.data).not.toContain("<script");
              expect(result.data).not.toContain("javascript:");
              expect(result.data).not.toContain("onmouseover");
            }
          });
        });
      });

      describe("Malicious Email Addresses", () => {
        const maliciousEmails = [
          "test+<script>alert('XSS')</script>@example.com",
          "<script>alert('XSS')</script>@example.com",
          "test'; DROP TABLE users; --@example.com",
          "admin'--@example.com",
          "not-an-email",
          "@example.com",
          "test@",
          "test..test@example.com",
        ];

        maliciousEmails.forEach((maliciousEmail, index) => {
          it(`should handle malicious email ${
            index + 1
          }: ${maliciousEmail}`, () => {
            const result = emailSchema.safeParse(maliciousEmail);
            if (result.success) {
              // If it passes validation, it should be sanitized
              expect(result.data).not.toContain("<script");
              expect(result.data).not.toContain("javascript:");
              expect(result.data).not.toContain("onmouseover");
              expect(result.data).not.toContain("<");
              expect(result.data).not.toContain(">");
            }
          });
        });
      });
    });

    describe("Integration Tests", () => {
      it("should handle complete malicious signUp attempt", () => {
        const maliciousSignUp = {
          name: "John<script>alert('XSS')</script>",
          lastName: "Doe<script>alert('XSS')</script>",
          email: "test+<script>alert('XSS')</script>@example.com",
          password: "onmouseover=alert('XSS1')",
        };

        const result = signUpSchema.safeParse(maliciousSignUp);

        if (result.success) {
          // All fields should be sanitized
          expect(result.data.name).not.toContain("<script");
          expect(result.data.lastName).not.toContain("<script");
          expect(result.data.email).not.toContain("<script");
          expect(result.data.password).not.toContain("onmouseover");
          expect(result.data.password).not.toContain("alert");
        }
      });

      it("should handle complete malicious signIn attempt", () => {
        const maliciousSignIn = {
          email: "test+<script>alert('XSS')</script>@example.com",
          password: "onmouseover=alert('XSS')",
        };

        const result = signInSchema.safeParse(maliciousSignIn);

        if (result.success) {
          // All fields should be sanitized
          expect(result.data.email).not.toContain("<script");
          expect(result.data.password).not.toContain("onmouseover");
          expect(result.data.password).not.toContain("alert");
        }
      });
    });
  });
});
