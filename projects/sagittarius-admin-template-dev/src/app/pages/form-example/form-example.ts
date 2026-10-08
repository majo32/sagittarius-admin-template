import { Component, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';

/** Ukážka formulára: sekcie, validácie, dynamické položky, súhrn. */
@Component({
  selector: 'app-form-example',
  imports: [
    CurrencyPipe, ReactiveFormsModule, MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule,
    MatIconModule, MatInputModule, MatRadioModule, MatSelectModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './form-example.html',
  styleUrl: './form-example.scss'
})
export class FormExample {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly snackBar = inject(MatSnackBar);

  protected readonly customers = ['Tatra Logistics s.r.o.', 'Kovo Trenčín a.s.', 'Danubia Foods', 'Mesto Žilina', 'Poprad Hotels'];

  protected readonly form = this.fb.group({
    customer: ['', Validators.required],
    contactEmail: ['', [Validators.required, Validators.email]],
    deliveryDate: [null as Date | null, Validators.required],
    delivery: ['courier'],
    items: this.fb.array([this.createItem('Licencia Sagittarius – ročná', 1, 1200)]),
    note: ['', Validators.maxLength(500)],
    invoiceByEmail: [true],
    terms: [false, Validators.requiredTrue],
  });

  private readonly value = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });
  protected readonly total = computed(() =>
    (this.value().items ?? []).reduce((sum, i) => sum + (i.quantity ?? 0) * (i.price ?? 0), 0));

  get items(): FormArray {
    return this.form.controls.items;
  }

  private createItem(name = '', quantity = 1, price = 0) {
    return this.fb.group({
      name: [name, Validators.required],
      quantity: [quantity, [Validators.required, Validators.min(1)]],
      price: [price, [Validators.required, Validators.min(0)]],
    });
  }

  protected addItem() {
    this.items.push(this.createItem());
  }

  protected removeItem(i: number) {
    this.items.removeAt(i);
  }

  protected reset() {
    this.form.reset();
    this.items.clear();
    this.addItem();
  }

  protected submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snackBar.open('Formulár obsahuje chyby', 'OK', { duration: 3000 });
      return;
    }
    this.snackBar.open('Objednávka bola odoslaná (demo)', 'OK', { duration: 3000 });
    this.reset();
  }
}
