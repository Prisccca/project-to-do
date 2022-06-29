import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup , FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';



@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  employeesList = ["Holly", "Simon", "Kim", "Brian"]

  taskForm !: FormGroup;

  actionBtn : string = "Salvar"

  

  constructor( private formBuilder : FormBuilder , private api : ApiService , 
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef : MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {
    this.taskForm = this.formBuilder.group({

      taskName : [' ',Validators.required],
      descriptionTask : [' ', Validators.required],
      categoryTask : [' ', Validators.required],
      assignedPerson : [ ' ', Validators.required],
      statusTask : [ ' ', Validators.required],
      dateTask : [ ' ', Validators.required]

    })

    if(this.editData){
      this.actionBtn = "Editar"
      this.taskForm.controls['taskName'].setValue(this.editData.taskName);
      this.taskForm.controls['descriptionTask'].setValue(this.editData.descriptionTask);
      this.taskForm.controls['categoryTask'].setValue(this.editData.categoryTask);
      this.taskForm.controls['assignedPerson'].setValue(this.editData.assignedPerson);
      this.taskForm.controls['statusTask'].setValue(this.editData.statusTask);
      this.taskForm.controls['dateTask'].setValue(this.editData.dateTask);
    }
  }

  addTask(){
    if(!this.editData){
      if (this.taskForm.valid){
        this.api.postTask(this.taskForm.value)
        .subscribe({
          next:(res)=>{
            alert("Tarefa Adicionada com sucesso!");
            this.taskForm.reset();
            this.dialogRef.close('save');
  
          },
          error:()=>{
            alert("Erro ao adicionar tarefa")
          }
        })
      }
    } else {
      this.updateTask()
    }
  }

  updateTask(){
    this.api.putTask(this.taskForm.value, this.editData.id)
    .subscribe({
      next: (res)=>{
        alert("Tarefa editada com sucesso!");
        this.taskForm.reset();
        this.dialogRef.close('update');
      },
      error:()=>{
        alert("Erro ao editar a tarefa!");
      }
    })
  }

}


