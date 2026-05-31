import {
  createTask,
  validateTaskTitle,
  deleteTask,
  validateLogin,
} from "../utils/taskUtils";

describe("Task Utils - 单元测试", () => {
  describe("validateTaskTitle", () => {
    it("应该返回true当标题非空时", () => {
      expect(validateTaskTitle("Buy groceries")).toBe(true);
    });

    it("应该返回false当标题为空字符串时", () => {
      expect(validateTaskTitle("")).toBe(false);
    });

    it("应该返回false当标题只有空格时", () => {
      expect(validateTaskTitle("   ")).toBe(false);
    });
  });

  describe("validateLogin", () => {
    it("应该返回true当用户名和密码都非空时", () => {
      expect(validateLogin("testuser", "password123")).toBe(true);
    });

    it("应该返回false当用户名为空时", () => {
      expect(validateLogin("", "password123")).toBe(false);
    });

    it("应该返回false当密码为空时", () => {
      expect(validateLogin("testuser", "")).toBe(false);
    });
  });

  describe("createTask", () => {
    it("应该创建一个带有正确属性的任务", () => {
      const task = createTask("Test Task", "2026-06-01");
      expect(task.title).toBe("Test Task");
      expect(task.date).toBe("2026-06-01");
      expect(task.id).toBeDefined();
    });

    it("应该使用默认日期当没有提供日期时", () => {
      const task = createTask("Test Task", "");
      expect(task.date).toBe("No date selected");
    });
  });

  describe("deleteTask", () => {
    it("应该从任务列表中删除指定id的任务", () => {
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
