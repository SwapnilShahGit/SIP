import { Component, Input, OnInit} from '@angular/core';
import { User} from '../../../meta/user';
import {TaskStore}from './TaskStore';
import { DatabaseService } from '../../../meta/database.service';


@Component({
  selector: 'tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})

export class TasksComponent implements OnInit{
    private newTask;
    private store = new TaskStore();
    private items= this.store.items;

  @Input()
  public user: User;

  constructor(private databaseService: DatabaseService) {
  }

  public ngOnInit(){
    for (var i = 0; i < this.user.tasks.length; i++)
      {
        this.items.push({
          text:  this.user.tasks[i].text,  
          done: this.user.tasks[i].done 
        }); 
      }
  }  

   public updateUser() {
      for (var i = 0; i < this.items.length; i++)
      {
        this.user.tasks[i] = {
          text: this.items[i].text,
          done: this.items[i].done
        }
      }
      this.databaseService.updateUser(this.user).then(response => {
        if (response.error != '0') {
          window.alert('Error occured during update API call: ' + response.data);
        } else {

        }

      }); 
   }

  public addTask() {
    if (document.getElementById("newInputTask").value == "") return;
    this.items.push({
      text: this.newTask,  
      done: false  
    });
    this.updateUser();
    document.getElementById("newInputTask").value="";
  }
    
  public removeTask(index: number) {
    this.items.splice(index, 1); 
    this.user.tasks.splice(index, 1); 
    this.updateUser();
  }

  public clickTask(item: any, index: number) {
    var ele = document.getElementsByTagName('label');
    if (item.done === false) { 
      this.items[index].done = true;
    }
    else { 
      this.items[index].done = false;
    }
    this.updateUser();
  }


}