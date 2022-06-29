import {Component, OnInit,ViewChild } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'project-to-do';

  displayedColumns: string[] = ['taskName', 'descriptionTask', 'categoryTask','assignedPerson','statusTask','dateTask','actions'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor( private dialog : MatDialog, private api : ApiService){

  }

  ngOnInit(): void{
    this.getAllTasks();
  }

  openDialog() {
    this.dialog.open(DialogComponent, {
      width:'40%'
    }).afterClosed().subscribe(val=>{
      if(val === 'save'){
        this.getAllTasks();
      }

    })
  }

  getAllTasks(){
    this.api.getTask()
    .subscribe({
      next: (res)=>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort
      },
      error:(err)=>{
        alert("Erro de busca de registros")
      }

    })

  }

  editTask(row: any){
    this.dialog.open (DialogComponent,{
      width: '40%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val === 'update'){
        this.getAllTasks();
      }
  })
}

  deleteTask(id: number){
    this.api.deleteTask(id)
    .subscribe({
      next: (res)=>{
        alert("Tarefa apagada com sucesso!!");
        this.getAllTasks();
      },
      error:()=>{
        alert("Erro durante o apagamento da Tarefa!")
      }
    })

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


}
