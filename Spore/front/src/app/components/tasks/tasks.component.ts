import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../../meta/user';
import {TaskStore} from './task-store';
import {DatabaseService} from '../../../meta/database.service';


@Component({
  selector: 'tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})

<<<<<<< HEAD
export class TasksComponent implements OnInit {
  private newTask = "";
  private store = new TaskStore();
  private items = this.store.items;
=======
export class TasksComponent implements OnInit{
    private newTask = "";
    private store = new TaskStore();
    private items = this.store.items; 
>>>>>>> the tasks now autogrow to fit the entire task text [#486]

  @Input()
  public user: User;

  constructor(private databaseService: DatabaseService) {  
  }

  public ngOnInit() {
    this.items = this.user.tasks;
  }

  public auto_grow() {
      var textAreas= document.querySelectorAll("textArea");
      for(var x = 0; x < textAreas.length; x++){
         (<HTMLElement>textAreas[x]).style.height ="";
            (<HTMLElement>textAreas[x]).style.height = (<HTMLElement>textAreas[x]).scrollHeight + "px";
      }
  }

  public updateUser() {
      let tempUser = this.user;
      tempUser.tasks = this.items;
      this.databaseService.updateUser(tempUser).then(response => {
        if (response.error != '0') {
          window.alert('Error occured during update API call: ' + response.data);
        } else{
          this.user = tempUser;
        }
      }); 
   }

  public addTask() {
    if (this.newTask === "") return;
    var tempdate = new Date();
    var currentdate = "Created " + tempdate.toLocaleString('en-US', { month: "long" }) + " " + tempdate.getDate() + ", " + tempdate.getFullYear() + " " + tempdate.toLocaleString('en-US', { hour: 'numeric',minute:'numeric', hour12: true });
    this.items.push({
      text: this.newTask,  
      done: false,  
      date: currentdate
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

};
