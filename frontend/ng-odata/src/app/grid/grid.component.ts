import { Component, OnInit, signal } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  SortChangedEvent,
  PaginationChangedEvent,
} from 'ag-grid-community';
import { UsersService } from '../services/users.service';
import { User } from '../models/user';
import { Response } from '../models/response';
import { HttpParams } from '@angular/common/http';

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
    {
      field: 'FirstName',
      headerName: 'First name',
      comparator: this.emptyComparere,
    },
    {
      field: 'LastName',
      headerName: 'Last name',
      comparator: this.emptyComparere,
    },
    { field: 'Email', headerName: 'Email', comparator: this.emptyComparere },
    {
      field: 'CreatedAt',
      headerName: 'Created At',
      comparator: this.emptyComparere,
    },
  ];

  private grid?: GridApi<any>;

  constructor(private usersService: UsersService) {}

  public onGridReady(grid: GridReadyEvent): void {
    this.grid = grid.api;
    grid.api.sizeColumnsToFit();
  }

  public onSortChanged(sort: SortChangedEvent): void {
    const columns = sort.columns?.filter((x) => x.getSort());

    if (columns?.length && columns.length > 0) {
      const first = columns[0];

      this.loadData({
        sortBy: first.getColDef().field,
        sortDirection: first.getSort() === 'asc' ? 'asc' : 'desc',
      });
      return;
    }

    this.loadData({
      sortBy: undefined,
      sortDirection: undefined,
    });
  }

  public onPaginationChanged(pagination: PaginationChangedEvent): void {
    if (pagination.newPage || pagination.newPageSize) {
      const page = pagination.api.paginationGetCurrentPage();
      const pageSize = pagination.api.paginationGetPageSize();
      this.loadData({
        page: page + 1,
        pageSize: pageSize,
      });
    }
  }

  public ngOnInit(): void {
    this.loadData();
  }

  private options: {
    sortBy?: string;
    sortDirection?: string;
    page: number;
    pageSize: number;
  } = {
    page: 1,
    pageSize: 5,
  };

  private loadData(o?: {
    sortBy?: string;
    sortDirection?: string;
    page?: number;
    pageSize?: number;
  }): void {
    const options = {
      ...this.options,
      ...o,
    };

    let params = new HttpParams();

    if (options) {
      if (options.sortBy) {
        params = params.append(
          '$orderBy',
          `${options.sortBy} ${options.sortDirection ?? 'asc'}`
        );
      }

      if (options.page) {
        const skip = (options.page - 1) * options.pageSize;

        if (skip) {
          params = params.append('$skip', skip);
        }

        params = params.append('$top', options.pageSize);
      }
    }

    this.usersService
      .getUsers<User>(params)
      .subscribe((data: Response<User>) => {
        this.rowData.set(data.value);
      });

    this.options = options;
  }

  private emptyComparere(x: any, y: any): number {
    return 0;
  }
}
