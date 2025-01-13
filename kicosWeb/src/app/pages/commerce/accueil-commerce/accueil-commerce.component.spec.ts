import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccueilCommerceComponent } from './accueil-commerce.component';

describe('AccueilCommerceComponent', () => {
  let component: AccueilCommerceComponent;
  let fixture: ComponentFixture<AccueilCommerceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccueilCommerceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccueilCommerceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
