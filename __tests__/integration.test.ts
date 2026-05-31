import {
  createTask,
  deleteTask,
  validateTaskTitle,
} from "../utils/taskUtils";

describe("任务管理 - 集成测试", () => {
  it("应该完整的任务创建和删除流程", () => {
    const tasks: any[] = [];

    const task1 = createTask("完成作业", "2026-06-01");
    expect(validateTaskTitle(task1.title)).toBe(true);
    tasks.push(task1);

    const task2 = createTask("购物", "2026-06-02");
    tasks.push(task2);

    expect(tasks).toHaveLength(2);

    const updatedTasks = deleteTask(tasks, task1.id);
    expect(updatedTasks).toHaveLength(1);
    expect(updatedTasks[0].id).toBe(task2.id);
  });

  it("应该阻止创建无效标题的任务", () => {
    const invalidTitle = "";
    expect(validateTaskTitle(invalidTitle)).toBe(false);
  });
});
