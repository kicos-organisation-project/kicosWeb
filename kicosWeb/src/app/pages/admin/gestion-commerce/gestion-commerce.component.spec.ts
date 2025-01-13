import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCommerceComponent } from './gestion-commerce.component';

describe('GestionCommerceComponent', () => {
  let component: GestionCommerceComponent;
  let fixture: ComponentFixture<GestionCommerceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionCommerceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionCommerceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
