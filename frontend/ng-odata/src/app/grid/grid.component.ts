import { Component, OnInit, signal } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { UsersService } from '../services/users.service';
import { User } from '../models/user';
import { Response } from '../models/response';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
})
export class GridComponent implements OnInit {
  rowData = signal<User[]>([]);

  colDefs: ColDef[] = [
    { field: 'Id', headerName: 'Id' },
    { field: 'FirstName', headerName: 'First name' },
    { field: 'LastName', headerName: 'Last name' },
    { field: 'Email', headerName: 'Email' },
    { field: 'CreatedAt', headerName: 'Created At' },
  ];

  constructor(private usersService: UsersService) {}

  public onGridReady(grid: GridReadyEvent): void {
    grid.api.sizeColumnsToFit();
  }

  public ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.usersService.getUsers<User>().subscribe((data: Response<User>) => {
      this.rowData.set(data.value);
    });
  }
}
