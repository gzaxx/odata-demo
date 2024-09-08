import { Component, OnInit, signal } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  FilterChangedEvent,
  SortChangedEvent,
  ITextFilterParams,
} from 'ag-grid-community';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { UsersService } from '../services/users.service';
import { User } from '../models/user';
import { Response } from '../models/response';
import { HttpParams } from '@angular/common/http';
import { BehaviorSubject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [AgGridAngular, MatPaginatorModule, MatButtonModule, MatInputModule],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
})
export class GridComponent implements OnInit {
  rowData = signal<User[]>([]);
  totalPages = signal<number>(0);

  private search$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  colDefs: ColDef[] = [
    { field: 'Id', headerName: 'Id' },
    {
      field: 'FirstName',
      headerName: 'First name',
      comparator: this.emptyComparere,
      filter: true,
      filterParams: {
        maxNumConditions: 1,
        buttons: ['clear'],
        filterOptions: ['equals', 'contains'],
        textMatcher: (_) => {
          return true;
        },
      } as ITextFilterParams,
    },
    {
      field: 'LastName',
      headerName: 'Last name',
      comparator: this.emptyComparere,
      filter: true,
      filterParams: {
        maxNumConditions: 1,
        buttons: ['clear'],
        filterOptions: ['equals', 'contains'],
        textMatcher: (_) => {
          return true;
        },
      } as ITextFilterParams,
    },
    {
      field: 'Email',
      headerName: 'Email',
      comparator: this.emptyComparere,
      filter: true,
      filterParams: {
        maxNumConditions: 1,
        buttons: ['clear'],
        filterOptions: ['equals', 'contains'],
        textMatcher: (_) => {
          return true;
        },
      } as ITextFilterParams,
    },
    {
      field: 'CreatedAt',
      headerName: 'Created At',
      comparator: this.emptyComparere,
    },
  ];

  private grid?: GridApi<any>;

  constructor(private usersService: UsersService) {}

  public seed(): void {
    this.usersService.seed().subscribe((_) => this.loadData());
  }

  public onGridReady(grid: GridReadyEvent): void {
    this.grid = grid.api;
    grid.api.sizeColumnsToFit();
  }

  onSearch(value: any): void {
    this.search$.next(value.target.value);
  }

  public onFilterChanged($event: FilterChangedEvent): void {
    console.log(`Filter Changed`);
    const filter = $event.api.getFilterModel();
    if (Object.keys(filter).length > 0) {
      Object.entries(filter).map(([key, value]) => {
        const filter = <Filter>{
          column: key,
          operation: value.type,
          value: value.filter,
        };

        this.loadData({
          filter: filter,
        });
      });

      return;
    }
    this.loadData({
      filter: undefined,
    });
  }

  public onSortChanged($event: SortChangedEvent): void {
    const columns = $event.columns?.filter((x) => x.getSort());

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

  public onPaginationChanged(pagination: PageEvent): void {
    this.loadData({
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
    });
  }

  public ngOnInit(): void {
    this.search$.pipe(debounceTime(300)).subscribe((x) => {
      this.loadData({
        search: x,
      });
    });

    this.loadData();
  }

  private options: ApiOptions = {
    page: 1,
    pageSize: 10,
  };

  private loadData(o?: {
    sortBy?: string;
    sortDirection?: string;
    page?: number;
    pageSize?: number;
    search?: string;
    filter?: Filter;
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

      if (options.search) {
        params = params.append('$search', options.search);
      }

      if (options.filter) {
        const filter = options.filter;

        switch (filter.operation) {
          case 'equals':
            params = params.append(
              '$filter',
              `${filter.column} eq '${filter.value}'`
            );
            break;
          case 'contains':
            params = params.append(
              '$filter',
              `contains(toLower(${filter.column}), toLower('${filter.value}'))`
            );
            break;
        }
      }
    }
    this.grid?.setGridOption('loading', true);
    this.usersService
      .getUsers<User>(params)
      .subscribe((data: Response<User>) => {
        this.rowData.set(data.value);
        this.totalPages.set(data['@odata.count']);
        this.grid?.setGridOption('loading', false);
      });

    this.options = options;
  }

  private emptyComparere(x: any, y: any): number {
    return 0;
  }
}

type ApiOptions = {
  sortBy?: string;
  sortDirection?: string;
  page: number;
  pageSize: number;
  filter?: Filter;
};

type Filter = {
  column: string;
  operation: string;
  value: string;
};
