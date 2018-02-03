import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenviduComponent } from './openvidu.component';

describe('OpenviduComponent', () => {
  let component: OpenviduComponent;
  let fixture: ComponentFixture<OpenviduComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenviduComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenviduComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
