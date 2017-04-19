export class TaskItem {
  text: String;
  done: boolean;
  date: string;
  edit: boolean;
  editDate: string;
}

export class TaskStore {
  items: TaskItem[] = [];
}
