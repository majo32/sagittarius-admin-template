import { Component, OnInit, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DrawerRef } from 'sagittarius-admin-template';
import { DemoUser, STATUS_LABELS, UserRole, UserStatus } from '../../core/demo-data';
import { UsersStore } from '../../core/users.store';

/** Formulár pre vytvorenie/úpravu používateľa – zobrazuje sa v draweri aj na samostatnej stránke (UserFormPage). */
@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule],
  templateUrl: './user-form.html',
})
export class UserForm implements OnInit {
  /** `null`, ak formulár nie je v draweri (samostatná stránka). */
  protected readonly drawerRef = inject(DrawerRef, { optional: true });
  private readonly router = inject(Router);
  private readonly store = inject(UsersStore);
  private readonly snackBar = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder).nonNullable;

  /** Ak chýba, formulár vytvára nového používateľa. */
  readonly user = input<DemoUser>();

  protected readonly roles: UserRole[] = ['Administrátor', 'Editor', 'Čitateľ'];
  protected readonly departments = ['Obchod', 'Financie', 'IT', 'Marketing', 'Zákaznícka podpora'];
  protected readonly statusLabels = STATUS_LABELS;
  protected readonly statuses = Object.keys(STATUS_LABELS) as UserStatus[];

  protected readonly form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    role: ['Čitateľ' as UserRole, Validators.required],
    department: ['Obchod', Validators.required],
    status: ['invited' as UserStatus, Validators.required],
  });

  ngOnInit() {
    const u = this.user();
    if (u) {
      this.form.patchValue(u);
    }
  }

  protected save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const existing = this.user();
    const now = new Date().toISOString();
    this.store.save({
      ...(existing ?? { id: this.store.nextId(), createdAt: now.slice(0, 10), lastLogin: now }),
      ...this.form.getRawValue(),
    });
    this.snackBar.open(existing ? 'Zmeny boli uložené' : 'Používateľ bol vytvorený', 'OK', { duration: 3000 });
    this.finish();
  }

  protected cancel() {
    this.finish();
  }

  /** V draweri zavrie vrstvu, na samostatnej stránke sa vráti na detail / zoznam. */
  private finish() {
    if (this.drawerRef) {
      this.drawerRef.close();
      return;
    }
    const existing = this.user();
    this.router.navigate(existing ? ['/users', existing.id] : ['/users']);
  }
}
