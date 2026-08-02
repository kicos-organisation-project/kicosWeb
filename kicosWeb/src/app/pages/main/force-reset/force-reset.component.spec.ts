import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ForceResetComponent } from './force-reset.component';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { MessageService } from '../../../core/services/message.service';

describe('ForceResetComponent (integration)', () => {
  let component: ForceResetComponent;
  let fixture: ComponentFixture<ForceResetComponent>;
  let auth: jasmine.SpyObj<AuthService>;
  let api: jasmine.SpyObj<ApiService>;
  let router: jasmine.SpyObj<Router>;
  let messageService: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    auth = jasmine.createSpyObj('AuthService', [
      'isAuthenticated',
      'mustResetPassword',
      'setMustResetPassword',
      'getDefaultHomeRoute',
    ]);
    api = jasmine.createSpyObj('ApiService', ['postWithSessionId']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    messageService = jasmine.createSpyObj('MessageService', ['createMessage']);

    auth.isAuthenticated.and.returnValue(true);
    auth.mustResetPassword.and.returnValue(true);
    auth.getDefaultHomeRoute.and.returnValue('/kicos/commerce');

    await TestBed.configureTestingModule({
      imports: [ForceResetComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: auth },
        { provide: ApiService, useValue: api },
        { provide: Router, useValue: router },
        { provide: MessageService, useValue: messageService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForceResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('rejects mismatched passwords', () => {
    component.resetForm.setValue({
      new_password: 'Secret1!',
      new_password_confirmation: 'Other1!',
    });

    // bypass angular validators to hit mismatch branch
    Object.defineProperty(component.resetForm, 'valid', { get: () => true });

    component.onSubmitForceReset();

    expect(messageService.createMessage).toHaveBeenCalledWith(
      'error',
      'Les mots de passe ne correspondent pas'
    );
    expect(api.postWithSessionId).not.toHaveBeenCalled();
  });

  it('clears must_reset_password and redirects on success', fakeAsync(() => {
    api.postWithSessionId.and.returnValue(of({ message: 'OK' }));

    component.resetForm.setValue({
      new_password: 'Secret1!',
      new_password_confirmation: 'Secret1!',
    });
    Object.defineProperty(component.resetForm, 'valid', { get: () => true });

    component.onSubmitForceReset();
    tick();

    expect(auth.setMustResetPassword).toHaveBeenCalledWith(false);
    expect(router.navigate).toHaveBeenCalledWith(['/kicos/commerce']);
  }));
});
