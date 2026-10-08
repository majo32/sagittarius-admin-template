import { AfterViewInit, Component, ViewChild, computed, effect, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DrawerService } from 'sagittarius-admin-template';
import { DemoUser, STATUS_BADGE, STATUS_LABELS, UserStatus } from '../../core/demo-data';
import { UsersStore } from '../../core/users.store';
import { UserDetail } from '../user-detail/user-detail';
import { UserForm } from '../user-form/user-form';

@Component({
  selector: 'app-users',
  imports: [
    DatePipe, FormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule,
    MatPaginatorModule, MatSelectModule, MatSortModule, MatTableModule,
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class Users implements AfterViewInit {
  private readonly drawer = inject(DrawerService);
  private readonly store = inject(UsersStore);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  protected readonly statusLabels: Record<string, string> = STATUS_LABELS;
  protected readonly statusBadge: Record<string, string> = STATUS_BADGE;
  protected readonly statuses = Object.keys(STATUS_LABELS) as UserStatus[];
  protected readonly roles = ['Administrátor', 'Editor', 'Čitateľ'];
  protected readonly columns = ['name', 'role', 'department', 'status', 'lastLogin', 'actions'];

  protected readonly search = signal('');
  protected readonly role = signal('');
  protected readonly status = signal('');

  protected readonly filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    return this.store.users().filter(u =>
      (!q || `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(q)) &&
      (!this.role() || u.role === this.role()) &&
      (!this.status() || u.status === this.status()));
  });

  protected readonly dataSource = new MatTableDataSource<DemoUser>([]);

  constructor() {
    effect(() => {
      this.dataSource.data = this.filtered();
      this.paginator?.firstPage();
    });
    this.dataSource.sortingDataAccessor = (u, col) => col === 'name' ? `${u.lastName} ${u.firstName}` : (u as any)[col];
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  protected clearFilters() {
    this.search.set('');
    this.role.set('');
    this.status.set('');
  }

  protected openDetail(user: DemoUser) {
    this.drawer.open(UserDetail, { userId: user.id }, {
      title: `${user.firstName} ${user.lastName}`,
      // ikona v pravom rohu hlavičky drawera otvorí detail ako samostatnú stránku
      fullPageUrl: ['/users', user.id],
    });
  }

  protected create() {
    this.drawer.open(UserForm, {}, { title: 'Nový používateľ', fullPageUrl: '/users/new' });
  }
}
