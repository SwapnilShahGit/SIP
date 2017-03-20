import { Component, Input} from '@angular/core';
import {TaskStore}from './TaskStore';



@Component({
  selector: 'tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})

export class TasksComponent {
    newTask = "";
    store = new TaskStore();
    items= this.store.items;

  addTask() {
    this.items.push({
      text: this.newTask    
    })

    document.getElementById("newInputTask").value="";
  }
    
}