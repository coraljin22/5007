import { validateLogin, createTask, deleteTask } from "../utils/taskUtils";

describe("TaskTisk应用 - 端到端测试", () => {
  it("应该模拟完整的用户使用流程", () => {
    const username = "testuser";
    const password = "testpass";

    expect(validateLogin(username, password)).toBe(true);

    const tasks: any[] = [];

    const task1 = createTask("学习React Native", "2026-06-01");
    tasks.push(task1);

    const task2 = createTask("完成测试报告", "2026-06-05");
    tasks.push(task2);

    expect(tasks).toHaveLength(2);
    expect(tasks[0].title).toBe("学习React Native");
    expect(tasks[1].title).toBe("完成测试报告");

    const updatedTasks = deleteTask(tasks, task1.id);
    expect(updatedTasks).toHaveLength(1);
    expect(updatedTasks[0].title).toBe("完成测试报告");
  });
});
