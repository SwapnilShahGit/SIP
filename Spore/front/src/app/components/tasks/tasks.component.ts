import { Component, Input} from '@angular/core';
import {TaskStore}from './TaskStore';



@Component({
  selector: 'tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})

export class TasksComponent {
    newTask = "";
    currentTask = "";
    store = new TaskStore();
    items= this.store.items;

  addTask() {
    this.items.push({
      text: this.newTask,  
      done: false  
    });

    document.getElementById("newInputTask").value="";
  }
    
  removeTask(index: number) {
    this.items.splice(index, 1); 
  }

  clickTask(item: any, index: number) {
    alert(item.done);
    if (item.done === false) { 
      this.items[index].done = true;
    }
    else { 
      this.items[index].done = false;
    }
  }

}