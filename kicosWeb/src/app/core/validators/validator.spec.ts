import { FormControl } from '@angular/forms';
import { ValidatorCore } from './validator';

describe('ValidatorCore', () => {
  describe('verifInputFonction', () => {
    it('rejects empty required values', () => {
      const result = ValidatorCore.verifInputFonction('', 'nom');
      expect(result.isValid).toBeFalse();
      expect(result.verifMessage).toContain('obligatoire');
    });

    it('rejects values shorter than minLength', () => {
      const result = ValidatorCore.verifInputFonction('A', 'nom', { minLength: 2 });
      expect(result.isValid).toBeFalse();
      expect(result.verifMessage).toContain('inférieur');
    });

    it('rejects values not matching regex', () => {
      const result = ValidatorCore.verifInputFonction('Jean123', 'nom');
      expect(result.isValid).toBeFalse();
      expect(result.verifMessage).toContain('caractères non autorisés');
    });

    it('accepts valid alphabetic names', () => {
      const result = ValidatorCore.verifInputFonction('Jean-Pierre', 'nom');
      expect(result.isValid).toBeTrue();
      expect(result.verifMessage).toBe('');
    });
  });

  describe('emailValidator', () => {
    const validator = ValidatorCore.emailValidator('email');

    it('flags invalid emails', () => {
      const control = new FormControl('not-an-email');
      expect(validator(control)).toEqual({
        error: true,
        message: `L'email doit respecter le format : yohan@gmail.com.`,
      });
    });

    it('accepts valid emails', () => {
      const control = new FormControl('user@kicos.test');
      expect(validator(control)).toBeNull();
    });
  });

  describe('checkPasswordValidity', () => {
    it('requires complexity', () => {
      expect(ValidatorCore.checkPasswordValidity(new FormControl('simple'))).toEqual({
        checkPasswordValidity: true,
      });
    });

    it('accepts strong passwords', () => {
      const control = new FormControl('Secret1!');
      expect(ValidatorCore.checkPasswordValidity(control)).toBeNull();
    });
  });
});
