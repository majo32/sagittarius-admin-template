import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { SagittariusAdmin } from './sagittarius-admin';

describe('SagittariusAdmin', () => {
  let component: SagittariusAdmin;
  let fixture: ComponentFixture<SagittariusAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SagittariusAdmin],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SagittariusAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render menu items and section spacers', () => {
    fixture.componentRef.setInput('menuItems', [
      { label: 'Sekcia', spacer: true },
      { label: 'Prehľad', icon: 'dashboard', route: '/dashboard' },
    ]);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('.sg-admin-theme-sidebar-nav-item').length).toBe(1);
    expect(el.querySelector('.sg-admin-theme-sidebar-nav-item-spacer')?.textContent).toContain('Sekcia');
  });

  it('should toggle collapsed sidebar on desktop', () => {
    fixture.componentRef.setInput('persistSidebarState', false);
    component.isHandset.set(false);
    component.toggleSidebar();
    fixture.detectChanges();
    expect(component.collapsed()).toBeTrue();
    expect((fixture.nativeElement as HTMLElement).querySelector('.sg-admin-theme-sidebar.collapsed')).toBeTruthy();
  });
});
