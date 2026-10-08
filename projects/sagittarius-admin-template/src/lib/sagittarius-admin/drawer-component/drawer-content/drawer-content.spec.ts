import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DrawerContent } from './drawer-content';
import { DrawerRef } from '../../drawer-ref';
import { SG_ADMIN_LABELS_SK, provideSgAdminLabels } from '../../sagittarius-admin.labels';

describe('DrawerContent', () => {
  let component: DrawerContent;
  let fixture: ComponentFixture<DrawerContent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawerContent],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawerContent);
    fixture.componentRef.setInput('drawerRef', new DrawerRef(() => {}));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('bez fullPageUrl nezobrazí ikonu celej stránky', () => {
    expect(fixture.nativeElement.querySelector('.sg-admin-theme-drawer-full-page')).toBeNull();
  });

  it('s fullPageUrl zobrazí odkaz na celú stránku', () => {
    component.drawerRef().setFullPageUrl(['/users', 42]);
    fixture.detectChanges();
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('.sg-admin-theme-drawer-full-page');
    expect(link).not.toBeNull();
    expect(link.getAttribute('href')).toBe('/users/42');
    expect(link.getAttribute('aria-label')).toBe('Open as full page');
  });

  it('fullPageLabel prebije predvolený text', () => {
    fixture.componentRef.setInput('fullPageLabel', 'Detail');
    component.drawerRef().setFullPageUrl('/users/42');
    fixture.detectChanges();
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('.sg-admin-theme-drawer-full-page');
    expect(link.getAttribute('aria-label')).toBe('Detail');
  });
});

describe('DrawerContent s provideSgAdminLabels', () => {
  it('použije zadané texty', async () => {
    await TestBed.configureTestingModule({
      imports: [DrawerContent],
      providers: [provideRouter([]), provideSgAdminLabels(SG_ADMIN_LABELS_SK)],
    }).compileComponents();
    const fixture = TestBed.createComponent(DrawerContent);
    fixture.componentRef.setInput('drawerRef', new DrawerRef(() => {}));
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.sg-admin-theme-drawer-close button');
    expect(button.getAttribute('aria-label')).toBe('Zavrieť');
  });
});
