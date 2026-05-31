type Task = {
  id: string;
  title: string;
  date: string;
};

export function createTask(title: string, date: string): Task {
  return {
    id: Date.now().toString(),
    title: title.trim(),
    date: date || "No date selected",
  };
}

export function validateTaskTitle(title: string): boolean {
  return title.trim().length > 0;
}

export function deleteTask(tasks: Task[], id: string): Task[] {
  return tasks.filter((task) => task.id !== id);
}

export function validateLogin(username: string, password: string): boolean {
  return username.trim().length > 0 && password.trim().length > 0;
}
