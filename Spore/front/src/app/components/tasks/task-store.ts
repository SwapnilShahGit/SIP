export class TaskItem {
  text: String;
  done: boolean;
  date: string;
}

export class TaskStore {
  items: TaskItem[] = [];
}
