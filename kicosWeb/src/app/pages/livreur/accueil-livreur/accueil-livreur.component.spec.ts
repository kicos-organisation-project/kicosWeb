import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccueilLivreurComponent } from './accueil-livreur.component';

describe('AccueilLivreurComponent', () => {
  let component: AccueilLivreurComponent;
  let fixture: ComponentFixture<AccueilLivreurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccueilLivreurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccueilLivreurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
