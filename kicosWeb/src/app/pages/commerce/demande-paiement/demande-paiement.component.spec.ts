import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandePaiementComponent } from './demande-paiement.component';

describe('DemandePaiementComponent', () => {
  let component: DemandePaiementComponent;
  let fixture: ComponentFixture<DemandePaiementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandePaiementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemandePaiementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
