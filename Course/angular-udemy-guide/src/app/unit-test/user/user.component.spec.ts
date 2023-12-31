import {
  ComponentFixture,
  TestBed,
  async,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { UserComponent } from './user.component';
import { UserService } from './user.service';
import { DataService } from '../shared/data.service';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserComponent],
    });
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    let fixture = TestBed.createComponent(UserComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should use the user name from the service', () => {
    let fixture = TestBed.createComponent(UserComponent);
    let app = fixture.debugElement.componentInstance;
    let userService = fixture.debugElement.injector.get(UserService);
    fixture.detectChanges();
    expect(userService.user.name).toEqual(app.user.name);
  });

  it("shouldn't display the user name if user is logged in", () => {
    let fixture = TestBed.createComponent(UserComponent);
    let app = fixture.debugElement.componentInstance;
    app.isLoggedIn = true;
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('p').textContent).not.toContain(
      app.user.name
    );
  });

  it("shouldn't fetch data successfully if not called asynchornously ", () => {
    let dataService = fixture.debugElement.injector.get(DataService);
    let spy = spyOn(dataService, 'gerDetails').and.returnValue(
      Promise.resolve('Data')
    );
    fixture.detectChanges();
    expect(component.data).toBe(undefined);
  });

  it("shouldn't fetch data successfully if called asynchornously ", async(() => {
    let dataService = fixture.debugElement.injector.get(DataService);
    let spy = spyOn(dataService, 'gerDetails').and.returnValue(
      Promise.resolve('Data')
    );
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.data).toBe('Data');
    });
  }));

  it("shouldn't fetch data successfully if called asynchornously ", fakeAsync(() => {
    let dataService = fixture.debugElement.injector.get(DataService);
    let spy = spyOn(dataService, 'gerDetails').and.returnValue(
      Promise.resolve('Data')
    );
    fixture.detectChanges();
    tick();
    expect(component.data).toBe('Data');
  }));
});
