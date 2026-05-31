import {
  createTask,
  deleteTask,
  validateTaskTitle,
} from "../utils/taskUtils";

describe("Task Management - Integration Tests", () => {
  it("should complete the task creation and deletion workflow", () => {
    const tasks: any[] = [];

    const task1 = createTask("Complete assignment", "2026-06-01");
    expect(validateTaskTitle(task1.title)).toBe(true);
    tasks.push(task1);

    const task2 = createTask("Buy groceries", "2026-06-02");
    tasks.push(task2);

    expect(tasks).toHaveLength(2);

    const updatedTasks = deleteTask(tasks, task1.id);
    expect(updatedTasks).toHaveLength(1);
    expect(updatedTasks[0].id).toBe(task2.id);
  });

  it("should prevent creating tasks with invalid titles", () => {
    const invalidTitle = "";
    expect(validateTaskTitle(invalidTitle)).toBe(false);
  });
});
