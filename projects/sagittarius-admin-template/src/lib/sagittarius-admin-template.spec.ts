import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SagittariusAdminTemplate } from './sagittarius-admin-template';

describe('SagittariusAdminTemplate', () => {
  let component: SagittariusAdminTemplate;
  let fixture: ComponentFixture<SagittariusAdminTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SagittariusAdminTemplate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SagittariusAdminTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
