import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../../meta/user';
import {TaskStore} from './TaskStore';
import {DatabaseService} from '../../../meta/database.service';


@Component({
  selector: 'tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})

export class TasksComponent implements OnInit {
  private newTask = "";
  private store = new TaskStore();
  private items = this.store.items;

  @Input()
  public user: User;

  constructor(private databaseService: DatabaseService) {
  }

  public ngOnInit() {
    this.items = this.user.tasks;
  }

  public updateUser() {
    let tempUser = this.user;
    tempUser.tasks = this.items;
    this.databaseService.updateUser(tempUser).then(response => {
      if (response.error != '0') {
        window.alert('Error occured during update API call: ' + response.data);
      } else {
        this.user = tempUser;
      }
    });
  }

  public addTask() {
    if (this.newTask === "") return;
    this.items.push({
      text: this.newTask,
      done: false
    });
    this.updateUser();
    this.newTask = "";
  }

  public removeTask(index: number) {
    this.items.splice(index, 1);
    this.updateUser();
  }

  public clickTask(item: any, index: number) {
    this.items[index].done = !item.done;
    this.updateUser();
  }

}
