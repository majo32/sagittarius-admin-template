import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DrawerContent } from './drawer-content';
import { DrawerRef } from '../../drawer-ref';

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
    expect(link.getAttribute('aria-label')).toBe('Otvoriť na celej stránke');
  });
});
