import verifyTaskProps from "./verifyDTicketProps";
import { TaskProps } from "../../models";

describe("verifyTaskProps", () => {
  const validTask: TaskProps = {
    id: "123",
    description: "Test task",
    dueDate: new Date("2024-01-01"),
    priority: "high",
    status: "todo",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    projectId: "project-123",
    userAccount: {
      id: 1,
      firstName: "Test",
      lastName: "User",
      role: "user",
      email: "test@example.com",
      createdAt: new Date(),
      updatedAt: new Date(),
      family: {
        id: 1,
        name: "Test Family",
        createdAt: new Date(),
      },
    },
    columnId: 1,
  };

  const validTaskInput = {
    ...validTask,
    dueDate: validTask.dueDate.toISOString(),
    createdAt: validTask.createdAt.toISOString(),
  };

  it("should verify and return valid task props", () => {
    const result = verifyTaskProps(validTaskInput);
    expect(result).toBeDefined();
    expect(result?.id).toBe(validTaskInput.id);
    expect(result?.description).toBe(validTaskInput.description);
    expect(result?.priority).toBe(validTaskInput.priority);
    expect(result?.status).toBe(validTaskInput.status);
    expect(result?.columnId).toBe(validTaskInput.columnId);
    expect(result?.userAccount).toEqual(validTaskInput.userAccount);
    // Verify date conversions
    expect(result?.dueDate).toBeInstanceOf(Date);
    expect(result?.createdAt).toBeInstanceOf(Date);
  });

  it("should return undefined for null input", () => {
    expect(verifyTaskProps(null)).toBeUndefined();
  });

  it("should return undefined for non-object input", () => {
    expect(verifyTaskProps("not an object")).toBeUndefined();
    expect(verifyTaskProps(123)).toBeUndefined();
    expect(verifyTaskProps(undefined)).toBeUndefined();
  });

  it("should return undefined when required string properties are missing", () => {
    const invalidTasks = [
      { ...validTaskInput, id: undefined },
      { ...validTaskInput, description: undefined },
      { ...validTaskInput, priority: undefined },
      { ...validTaskInput, status: undefined },
    ];

    invalidTasks.forEach((task) => {
      expect(verifyTaskProps(task)).toBeUndefined();
    });
  });

  it("should return undefined when required string properties have wrong type", () => {
    const invalidTasks = [
      { ...validTaskInput, id: 123 },
      { ...validTaskInput, description: 123 },
      { ...validTaskInput, priority: 123 },
      { ...validTaskInput, status: 123 },
    ];

    invalidTasks.forEach((task) => {
      expect(verifyTaskProps(task)).toBeUndefined();
    });
  });

  it("should return undefined when dates are invalid", () => {
    const invalidTasks = [
      { ...validTaskInput, dueDate: "invalid date" },
      { ...validTaskInput, createdAt: "invalid date" },
      { ...validTaskInput, dueDate: 123 },
      { ...validTaskInput, createdAt: 123 },
    ];

    invalidTasks.forEach((task) => {
      expect(verifyTaskProps(task)).toBeUndefined();
    });
  });

  it("should return undefined when userAccount is missing or invalid", () => {
    const invalidTasks = [
      { ...validTaskInput, userAccount: undefined },
      { ...validTaskInput, userAccount: null },
      { ...validTaskInput, userAccount: "not an object" },
    ];

    invalidTasks.forEach((task) => {
      expect(verifyTaskProps(task)).toBeUndefined();
    });
  });

  it("should return undefined when columnId is missing or invalid", () => {
    const invalidTasks = [
      { ...validTaskInput, columnId: undefined },
      { ...validTaskInput, columnId: "not a number" },
      { ...validTaskInput, columnId: null },
    ];

    invalidTasks.forEach((task) => {
      expect(verifyTaskProps(task)).toBeUndefined();
    });
  });
});
