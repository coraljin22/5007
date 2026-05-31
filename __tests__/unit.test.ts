import {
  createTask,
  deleteTask,
  validateLogin,
  validateTaskTitle,
} from "../utils/taskUtils";

describe("Task Utils - Unit Tests", () => {
  describe("validateTaskTitle", () => {
    it("should return true when the title is not empty", () => {
      expect(validateTaskTitle("Buy groceries")).toBe(true);
    });

    it("should return false when the title is an empty string", () => {
      expect(validateTaskTitle("")).toBe(false);
    });

    it("should return false when the title contains only whitespace", () => {
      expect(validateTaskTitle("   ")).toBe(false);
    });
  });

  describe("validateLogin", () => {
    it("should return true when the username and password are not empty", () => {
      expect(validateLogin("testuser", "password123")).toBe(true);
    });

    it("should return false when the username is empty", () => {
      expect(validateLogin("", "password123")).toBe(false);
    });

    it("should return false when the password is empty", () => {
      expect(validateLogin("testuser", "")).toBe(false);
    });
  });

  describe("createTask", () => {
    it("should create a task with the correct properties", () => {
      const task = createTask("Test Task", "2026-06-01");
      expect(task.title).toBe("Test Task");
      expect(task.date).toBe("2026-06-01");
      expect(task.id).toBeDefined();
    });

    it("should use the default date when no date is provided", () => {
      const task = createTask("Test Task", "");
      expect(task.date).toBe("No date selected");
    });
  });

  describe("deleteTask", () => {
    it("should remove the task with the specified id from the list", () => {
      const tasks = [
        { id: "1", title: "Task 1", date: "2026-06-01" },
        { id: "2", title: "Task 2", date: "2026-06-02" },
      ];
      const result = deleteTask(tasks, "1");
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("2");
    });
  });
});
