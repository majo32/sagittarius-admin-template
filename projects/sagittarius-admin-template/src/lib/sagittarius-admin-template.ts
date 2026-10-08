import { Component, signal } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'lib-sagittarius-admin-template',
  imports: [MatSlideToggleModule],
  template: `
    <p>
      sagittarius-admin-template works!
      {{test() }}
      <mat-slide-toggle>Toggle me!</mat-slide-toggle>
    </p>
  `,
  styles: ``
})
export class SagittariusAdminTemplate {

  test = signal("HW mkkmsfdnj")

}
