import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustedCompaniesComponent } from './trusted-companies.component';

describe('TrustedCompaniesComponent', () => {
  let component: TrustedCompaniesComponent;
  let fixture: ComponentFixture<TrustedCompaniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrustedCompaniesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrustedCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
