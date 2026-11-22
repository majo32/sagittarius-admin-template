import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DrawerService } from '../drawer-service';

import { DrawerComponent } from './drawer-component';

describe('DrawerComponent', () => {
  let component: DrawerComponent;
  let fixture: ComponentFixture<DrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({ template: 'layer' })
class TestLayer {}

describe('DrawerComponent – zatváranie vrstvy', () => {
  it('vrstvu zničí až po animácii odchodu a drawer zavrie po poslednej vrstve', fakeAsync(() => {
    TestBed.configureTestingModule({ imports: [DrawerComponent], providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(DrawerComponent);
    fixture.detectChanges();
    const service = TestBed.inject(DrawerService);
    const closeSpy = spyOn(service, 'close');
    const host: HTMLElement = fixture.nativeElement.parentElement;

    fixture.componentInstance.loadComponent(TestLayer);
    fixture.componentInstance.close();
    fixture.detectChanges();

    // počas animácie je vrstva ešte v DOM s triedou .leaving a drawer je otvorený
    tick(100);
    expect(host.querySelector('.sg-admin-theme-drawer-wrapper.leaving')).not.toBeNull();
    expect(closeSpy).not.toHaveBeenCalled();

    tick(300);
    fixture.detectChanges();
    expect(host.querySelectorAll('.sg-admin-theme-drawer-wrapper').length).toBe(0);
    expect(closeSpy).toHaveBeenCalledTimes(1);
  }));
});
