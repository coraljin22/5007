import { createTask, deleteTask, validateLogin } from "../utils/taskUtils";

describe("TaskTisk Application - End-to-End Tests", () => {
  it("should simulate the complete user workflow", () => {
    const username = "testuser";
    const password = "testpass";

    expect(validateLogin(username, password)).toBe(true);

    const tasks: any[] = [];

    const task1 = createTask("Learn React Native", "2026-06-01");
    tasks.push(task1);

    const task2 = createTask("Complete test report", "2026-06-05");
    tasks.push(task2);

    expect(tasks).toHaveLength(2);
    expect(tasks[0].title).toBe("Learn React Native");
    expect(tasks[1].title).toBe("Complete test report");

    const updatedTasks = deleteTask(tasks, task1.id);
    expect(updatedTasks).toHaveLength(1);
    expect(updatedTasks[0].title).toBe("Complete test report");
  });
});
