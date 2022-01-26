import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageComponent } from './usage.component';

describe('UsageComponent', () => {
  let component: UsageComponent;
  let fixture: ComponentFixture<UsageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [UsageComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
