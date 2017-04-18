export class TaskItem {
  text: String;
  done: boolean;
  date: string;
  edit: boolean;
}

export class TaskStore {
  items: TaskItem[] = [];
}
