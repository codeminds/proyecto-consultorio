import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionsPage } from './sessions.page';

describe('SessionsPage', () => {
  let component: SessionsPage;
  let fixture: ComponentFixture<SessionsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionsPage ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
