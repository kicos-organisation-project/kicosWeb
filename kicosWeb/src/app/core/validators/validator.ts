import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class ValidatorCore {
  /**
   * Valide les chaine en vérifiant si elle contient uniquement des espaces blancs
   * ou si elle commence ou se termine par des espaces.
   */
  static notOnlyWhitespace(control: FormControl): ValidationErrors | null {
    // Vérifiez si la chaîne contient uniquement des espaces blancs
    if (
      control.value != null &&
      (control.value.trim().length === 0 ||
        control.value.startsWith(' ') ||
        control.value.endsWith(' '))
    ) {
      //objet d'erreur non valide
      return { notOnlyWhitespace: true };
    } else {
      //Si c'est valide, on retourne null
      return null;
    }
  }

  /**
   * Valide une taille minimale
   *  Vérifie que la valeur d'un champ de formulaire a une longueur visible (après suppression des espaces)
   *  supérieure à 0 mais inférieure à 2 caractères, et qu'elle ne commence ni ne se termine par un espace.
   */
  static minLengthDisplayed(control: FormControl): ValidationErrors | null {
    if (
      control.value != null &&
      control.value.trim().length > 0 &&
      control.value.trim().length < 2 &&
      !control.value.startsWith(' ') &&
      !control.value.endsWith(' ')
    ) {
      return { minLengthDisplayed: true };
    } else {
      // valid, return null
      return null;
    }
  }

  /**
   * Vérifie que la longueur visible d'une chaîne (après suppression des espaces blancs au début et à la fin)
   * ne dépasse pas 40 caractères et que la chaîne ne commence ni ne se termine par un espace.
   */
  static maxLengthDisplayed(control: FormControl): ValidationErrors | null {
    if (
      control.value != null &&
      control.value.trim().length > 40 &&
      !control.value.startsWith(' ') &&
      !control.value.endsWith(' ')
    ) {
      // alert("Supérieur");
      return { maxLengthDisplayed: true };
    } else {
      // valid, return null
      return null;
    }
  }

  /**
   * Vérifie si la valeur d'un champ de formulaire contient des symboles ou caractères spéciaux
   * pour afficher retoutner une erreur de validation avec la clé checkValidOnlyLetterOrNumber.
   */
  static checkValidOnlyLetterOrNumber(
    control: FormControl
  ): ValidationErrors | null {
    const isNonWhiteSpace = /^\S*$/;
    const isContainsSymbol =
      /^(?=.*[~`!@#$%^*()+={}\[\]|\\:;"'<>,°²£µ§&`.?/_₹]).*$/;
    if (control.value != null && isContainsSymbol.test(control.value)) {
      return { checkValidOnlyLetterOrNumber: true };
    } else {
      return null;
    }
  }

  /**
   * Vérifie que la valeur d'un champ de formulaire ne contient que des lettres (sans chiffres ni symboles).
   * Si la valeur contient des chiffres ou des symboles, elle retourne une erreur de validation avec la clé
   * checkOnlyLetterValidato
   */
  static checkOnlyLetterValidator(
    control: FormControl
  ): ValidationErrors | null {
    const isContainsNumber = /^(?=.*[0-9]).*$/;
    const isContainsSymbol =
      /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,°²£µ§&`.?/_₹]).*$/;
    if (
      (control.value != null && isContainsNumber.test(control.value)) ||
      isContainsSymbol.test(control.value)
    ) {
      return { checkOnlyLetterValidator: true };
    } else {
      return null;
    }
  }

  /**
   * Elle est conçue pour valider les adresses, en s'assurant que si l'adresse contient un chiffre,
   * elle doit également contenir au moins une lettre (majuscule ou minuscule).
   * Si l'adresse ne contient pas de lettre, mais contient un chiffre, elle est considérée comme invalide,
   * et la fonction retourne une erreur de validation avec la clé checkAdresseValidator.
   * Si l'adresse contient des lettres (et éventuellement des chiffres), elle est validée comme correcte.
   */
  static checkAdresseValidator(control: FormControl): ValidationErrors | null {
    const isContainsNumber = /^(?=.*[0-9]).*$/;
    /*@Pour vérifier si l'adresse contient au moins une lettre*/
    const isContainsUppercase = /^(?=.*[A-Z]).*$/;
    const isContainsLowercase = /^(?=.*[a-z]).*$/;
    const isContainsSymbol =
      /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\;"'<>°²£µ§&`?₹]).*$/;
    if (
      control.value != null &&
      isContainsNumber.test(control.value) &&
      !isContainsLowercase.test(control.value) &&
      !isContainsUppercase.test(control.value)
    ) {
      // console.log("Adresse validation....");
      return { checkAdresseValidator: true };
    } else {
      return null;
    }
  }

  /**
   * Elle valide une adresse en s'assurant qu'elle ne contient pas seulement des symboles.
   * Pour qu'une adresse soit valide, si elle contient des symboles, elle doit également
   * contenir soit des chiffres, soit des lettres. Si elle contient uniquement des symboles,
   * elle est considérée comme invalide, et la fonction retourne une erreur de validation avec la clé validAdresseValidator.
   */
  static checkAdresseValidator2(control: FormControl): ValidationErrors | null {
    const isContainsNumber = /^(?=.*[0-9]).*$/;
    /*@Pour vérifier si l'adresse contient au moins une lettre*/
    const isContainsUppercase = /^(?=.*[A-Z]).*$/;
    const isContainsLowercase = /^(?=.*[a-z]).*$/;
    const isContainsSymbol = /^(?=.*[-,.]).*$/;
    if (
      control.value != null &&
      isContainsSymbol.test(control.value) &&
      !isContainsNumber.test(control.value) &&
      !isContainsLowercase.test(control.value) &&
      !isContainsUppercase.test(control.value)
    ) {
      return { validAdresseValidator: true };
    } else {
      return null;
    }
  }

  static validAdresseValidator(control: FormControl): ValidationErrors | null {
    const isContainsNumber = /^(?=.*[0-9]).*$/;
    /*@Pour vérifier si l'adresse contient au moins une lettre*/
    const isContainsUppercase = /^(?=.*[A-Z]).*$/;
    const isContainsLowercase = /^(?=.*[a-z]).*$/;
    const isContainsSymbol = /^(?=.*[-,.]).*$/;
    if (
      control.value != null &&
      isContainsSymbol.test(control.value) &&
      !isContainsNumber.test(control.value) &&
      !isContainsLowercase.test(control.value) &&
      !isContainsUppercase.test(control.value)
    ) {
      return { validAdresseValidator: true };
    } else {
      return null;
    }
  }

  /**
   * Vérifie si un champ de formulaire ne contient que des chiffres, sinon, elle retourne une
   * erreur de validation avec la clé checkOnlyNumberValidator
   */
  static checkOnlyNumberValidator(
    control: FormControl
  ): ValidationErrors | null {
    // const isNonWhiteSpace = /^\S*$/;
    const isContainsUppercase = /^(?=.*[A-Z]).*$/;
    const isContainsLowercase = /^(?=.*[a-z]).*$/;
    const isContainsSymbol =
      /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/;
    if (
      (control.value != null && isContainsUppercase.test(control.value)) ||
      isContainsLowercase.test(control.value) ||
      isContainsSymbol.test(control.value)
    ) {
      return { checkOnlyNumberValidator: true };
    } else {
      return null;
    }
  }

  /**
   * Valide un mot de passe pour s'assurer qu'il respecte les règles de sécurité courantes :
   * il ne doit pas contenir d'espaces blancs et doit inclure au moins une lettre majuscule,
   * une lettre minuscule, un chiffre, et un symbole
   */
  static checkPasswordValidity(control: FormControl): ValidationErrors | null {
    const isNonWhiteSpace = /^\S*$/;
    const isContainsUppercase = /^(?=.*[A-Z]).*$/;
    const isContainsLowercase = /^(?=.*[a-z]).*$/;
    const isContainsNumber = /^(?=.*[0-9]).*$/;
    const isContainsSymbol =
      /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/;
    if (
      (control.value != null && !isNonWhiteSpace.test(control.value)) ||
      !isContainsUppercase.test(control.value) ||
      !isContainsLowercase.test(control.value) ||
      !isContainsNumber.test(control.value) ||
      !isContainsSymbol.test(control.value)
    ) {
      return { checkPasswordValidity: true };
    }
    return null;
  }

  /**
   * Retourne le message d'erreur pour les champs obligatoires
   */
  static requiredValidator(controlName: string) {
    return (control: AbstractControl): ValidationErrors | null => {
      return !control.value.length
        ? { error: true, message: `${controlName} est obligatoire.` }
        : null;
    };
  }

  /**
   * Valide une adresse email.
   */
  static emailValidator(controlName: string) {
    return (control: AbstractControl): ValidationErrors | null => {
      let format = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$';
      return !control.value.length
        ? { error: true, message: `L'adresse ${controlName} est obligatoire.` }
        : !control.value.match(new RegExp(format))
        ? {
            error: true,
            message: `L'${controlName} doit respecter le format : yohan@gmail.com.`,
          }
        : null;
    };
  }

  /**
   * Valide les mot de passes
   */
  static passWordValidator(controlName: string, lengthWord: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      return !control.value.length
        ? { error: true, message: `${controlName} est obligatoire.` }
        : control.value.length < lengthWord
        ? {
            error: true,
            message: `${controlName} doit contenir au moins ${lengthWord} caractères.`,
          }
        : control.value != null &&
          control.value.startsWith(' ') &&
          control.value.endsWith(' ')
        ? //invalid, return error object
          {
            error: true,
            message: `Ce champs ne peut pas contenir des espaces.`,
          }
        : null;
    };
  }

  /**
   * Valide des chaines (Ex: nom, prenom ...)
   */
  static nameValidator(
    controlName: string,
    minLength: number,
    maxLength: number
  ): ValidatorFn {
    let patternalphabets = '^[A-Za-zéàèîôêûïëüö -]+$';

    return (name: AbstractControl): ValidationErrors | null => {
      if (!name.value) {
        return { error: true, message: `${controlName} est obligatoire.` };
      }
      if (!name.value.match(new RegExp(patternalphabets))) {
        return {
          error: true,
          message: `${controlName} ne doit contenir que des lettres.`,
        };
      }
      if (name.value.length < minLength) {
        return {
          error: true,
          message: `${controlName} doit contenir au moins  ${minLength} lettres.`,
        };
      }
      if (name.value.length > maxLength) {
        return {
          error: true,
          message: `${controlName} doit contenir au plus  ${maxLength} lettres.`,
        };
      }
      if (
        name.value != null &&
        name.value.startsWith(' ') &&
        name.value.endsWith(' ')
      ) {
        return {
          error: true,
          message: `Les espaces de début ou de fin ne sont pas autorisés.`,
        };
      }
      return null;
    };
  }

  static usernameValidator(
    controlName: string,
    minlength: number,
    maxlength: number
  ) {
    return (control: AbstractControl): ValidationErrors | null => {
      let patternalphabets = '^[A-Za-z0-9.-]+$';
      // let patternLettre=''^[A-Za-zéàèîôêûïëüö -]+$'';
      // let patternChiffre='';
      // let patternawithoutpace='';
      // let patternSpace = '^[a-zA-Z]{' + minlength + ',' + maxlength + '}$';
      return !control.value.length
        ? { error: true, message: `${controlName} est obligatoire.` }
        : !control.value.match(new RegExp(patternalphabets))
        ? {
            error: true,
            message: `${controlName} ne doit contenir que des lettres et des chiffres.`,
          }
        : control.value != null &&
          (control.value.startsWith(' ') || control.value.endsWith(' '))
        ? //invalid, return error object
          {
            error: true,
            message: `Ce champs ne peut pas contenir des espaces.`,
          }
        : // :((control.value != null) && (control.value.trim().length === 0 || control.value.startsWith(' ') || control.value.endsWith(' ')))
        // ? { error: true,
        //   'notOnlyWhitespace': true,
        //   message: `${controlName} ne doit pas contenir d'espace`
        // }
        // : !control.value.match(/^([a-zA-Z]+\s)*[a-zA-Z]+$/)
        //   ? {
        //       error: true,
        //       message: `Les espaces ne sont pas autorisés.`,
        //     }
        control.value.length < minlength
        ? {
            error: true,
            message: ` ${controlName} doit contenir au moins ${minlength} caractères.`,
          }
        : control.value.length > maxlength
        ? {
            error: true,
            message: `${controlName}  doit contenir au plus  ${maxlength} caractères.`,
          }
        : null;
    };
  }

  /**
   * Valide des chaines en ajoutant 2 autres options : le nom ne doit pas contenir uniquement des chiffres et pas uniquement des lettres
   */
  static nameAlphNumValidator(
    controlName: string,
    minLength: number,
    maxLength: number
  ): ValidatorFn {
    let patternalphabets = '^(s)*[a-zA-Z0-9éàèîôêûïëüö -]+$';
    let patternalphabets2 = '^(s)*[0-9]+$';
    return (name: AbstractControl): ValidationErrors | null => {
      if (!name.value) {
        return { error: true, message: `${controlName} est obligatoire.` };
      }
      if (!name.value.match(new RegExp(patternalphabets))) {
        return {
          error: true,
          message: `Le ${controlName} ne doit contenir que des lettres et des chiffres.`,
        };
      }
      if (name.value.match(new RegExp(patternalphabets2))) {
        return {
          error: true,
          message: `${controlName} ne doit pas contenir que des chiffres.`,
        };
      }
      if (
        name.value != null &&
        name.value.startsWith(' ') &&
        name.value.endsWith(' ')
      ) {
        return {
          error: true,
          message: `${controlName} Ce champs ne peut pas contenir des espaces.`,
        };
      }
      if (name.value.length < minLength) {
        return {
          error: true,
          message: `${controlName} doit contenir au moins  ${minLength} caractères.`,
        };
      }
      if (name.value.length > maxLength) {
        return {
          error: true,
          message: `${controlName} doit contenir au plus  ${maxLength} caractères.`,
        };
      }
      return null;
    };
  }

  /**
   * Verifie si une adresse est valide
   */
  static isValidAdress(
    controlName: string,
    minLength: number,
    maxLength: number
  ): ValidatorFn {
    const isContainsNumber = /^(?=.*[0-9]).*$/;
    const isContainsUppercase = /^(?=.*[A-Z]).*$/;
    const isContainsLowercase = /^(?=.*[a-z]).*$/;
    const isContainsSymbol = /^(?=.*[-,;.]).*$/;
    return (name: AbstractControl): ValidationErrors | null => {
      if (!name.value) {
        return { error: true, message: `${controlName} est obligatoire.` };
      }
      if (
        isContainsSymbol.test(name.value) &&
        !isContainsNumber.test(name.value) &&
        !isContainsLowercase.test(name.value) &&
        !isContainsUppercase.test(name.value)
      ) {
        return {
          error: true,
          message: `${controlName} ne doit pas contenir que des caractères spéciaux.`,
        };
      }
      if (
        isContainsNumber.test(name.value) &&
        !isContainsLowercase.test(name.value) &&
        !isContainsUppercase.test(name.value)
      ) {
        return {
          error: true,
          message: `${controlName} ne doit pas contenir que des chiffres.`,
        };
      }
      if (name.value.length < minLength) {
        return {
          error: true,
          message: `${controlName} doit contenir au moins  ${minLength} caractères.`,
        };
      }
      if (name.value.length > maxLength) {
        return {
          error: true,
          message: `${controlName} doit contenir au plus  ${maxLength} caractères.`,
        };
      }
      return null;
    };
  }

  /**
   * Vérifie que donnée est un alpha numérique valide
   */
  static isValidAlphNumValidator(
    controlName: string,
    minLength: number,
    maxLength: number
  ): ValidatorFn {
    let patternalphabets = '^(s)*[a-zA-Z0-9éàèîôêûïëüö -]+$';
    let patternalphabets2 = '^(s)*[0-9]+$';
    return (name: AbstractControl): ValidationErrors | null => {
      if (!name.value) {
        return { error: true, message: `` };
      }
      if (!name.value.match(new RegExp(patternalphabets))) {
        return {
          error: true,
          message: `Le ${controlName} ne doit contenir que des lettres et des chiffres.`,
        };
      }
      if (name.value.match(new RegExp(patternalphabets2))) {
        return {
          error: true,
          message: `${controlName} ne doit pas contenir que des chiffres.`,
        };
      }
      if (
        name.value != null &&
        name.value.startsWith(' ') &&
        name.value.endsWith(' ')
      ) {
        return {
          error: true,
          message: `${controlName} Ce champs ne peut pas contenir des espaces.`,
        };
      }
      if (name.value.length < minLength) {
        return {
          error: true,
          message: `${controlName} doit contenir au moins  ${minLength} caractères.`,
        };
      }
      if (name.value.length > maxLength) {
        return {
          error: true,
          message: `${controlName} doit contenir au plus  ${maxLength} caractères.`,
        };
      }
      return null;
    };
  }

  /**
   * Pour ne pas mettre uniquement des lettres
   */
  static nameAlphNumValidator2(
    controlName: string,
    minLength: number,
    maxLength: number
  ): ValidatorFn {
    let patternalphabets = '^(s)*[a-zA-Z0-9éàèîôêûïëüö -]+$';
    let patternalphabets2 = '^(s)*[a-zA-Z]+$';
    return (name: AbstractControl): ValidationErrors | null => {
      if (!name.value) {
        return { error: true, message: `${controlName} est obligatoire.` };
      }
      if (!name.value.match(new RegExp(patternalphabets))) {
        return {
          error: true,
          message: `Le ${controlName} ne doit contenir que des lettres et des chiffres.`,
        };
      }

      if (name.value.match(new RegExp(patternalphabets2))) {
        return {
          error: true,
          message: `${controlName} ne doit pas contenir que des lettres.`,
        };
      }

      if (
        name.value != null &&
        name.value.startsWith(' ') &&
        name.value.endsWith(' ')
      ) {
        return {
          error: true,
          message: `${controlName} Ce champs ne peut pas contenir des espaces.`,
        };
      }

      if (name.value.length < minLength) {
        return {
          error: true,
          message: `${controlName} doit contenir au moins  ${minLength} caractères.`,
        };
      }
      if (name.value.length > maxLength) {
        return {
          error: true,
          message: `${controlName} doit contenir au plus  ${maxLength} caractères.`,
        };
      }

      return null;
    };
  }

  /**
   *  Pour ne pas mettre uniquement des chiffres
   */
  static nameAlphNumValidator3(
    controlName: string,
    minLength: number,
    maxLength: number
  ): ValidatorFn {
    let patternalphabets = '^(s)*[a-zA-Z0-9éàèîôêûïëüö -]+$';
    let patternalphabets3 = '^(s)*[0-9]+$';
    return (name: AbstractControl): ValidationErrors | null => {
      if (!name.value) {
        return { error: true, message: `${controlName} est obligatoire.` };
      }
      if (!name.value.match(new RegExp(patternalphabets))) {
        return {
          error: true,
          message: `Le ${controlName} ne doit contenir que des lettres et des chiffres.`,
        };
      }

      if (name.value.match(new RegExp(patternalphabets3))) {
        return {
          error: true,
          message: `${controlName} ne doit pas contenir que des chiffres.`,
        };
      }

      if (
        name.value != null &&
        name.value.startsWith(' ') &&
        name.value.endsWith(' ')
      ) {
        return {
          error: true,
          message: `${controlName} Ce champs ne peut pas contenir des espaces.`,
        };
      }

      if (name.value.length < minLength) {
        return {
          error: true,
          message: `${controlName} doit contenir au moins  ${minLength} caractères.`,
        };
      }
      if (name.value.length > maxLength) {
        return {
          error: true,
          message: `${controlName} doit contenir au plus  ${maxLength} caractères.`,
        };
      }

      return null;
    };
  }

  // Gestion de messages d'erreurs du champs input date
  static dateValidator(controlName: string) {
    return (control: AbstractControl): ValidationErrors | null => {
      let today = new Date();
      let selectedDate = new Date(control.value);
      return !control.value.length
        ? { error: true, message: `${controlName} est obligatoire` }
        : selectedDate.getTime() > today.getTime()
        ? {
            error: true,
            message: `${controlName} ne peut pas être une date future.`,
          }
        : null;
    };
  }

  allNumberValidator(
    controlName: string,
    minLength: number,
    maxLength: number
  ) {
    let pattern = '^[0-9+]+(.?[0-9]+)?$';
    /* Add an extra backslash before \d if regex is constructed as a string. There is no need for // at the beginning and end of string if using RegExp  */
    return (control: AbstractControl): ValidationErrors | null => {
      return !control.value.length
        ? { error: true, message: `${controlName} est obligatoire.` }
        : !control.value.match(new RegExp(pattern))
        ? {
            error: true,
            message: `${controlName} ne doit contenir que des chiffres.`,
          }
        : control.value.length < minLength
        ? {
            error: true,
            message: `${controlName} doit contenir au moins  ${minLength} chiffres.`,
          }
        : control.value.length > maxLength
        ? {
            error: true,
            message: `${controlName} doit contenir au plus  ${maxLength} chiffres.`,
          }
        : control.value != null &&
          (control.value.trim().length === 0 ||
            control.value.startsWith(' ') ||
            control.value.endsWith(' '))
        ? {
            error: true,
            message: `Les espaces de débuts ou de fin ne sont pas autorisées..`,
          }
        : null;
    };
  }

  /**
   * Valide les numéro de téléphone
   */

  // static phoneValidator(
  //   controlName: string,
  //   minLength: number,
  //   maxLength: number
  // ) {
  //   let pattern = '^(78|76|70|33|77)[0-9]{7}$'; // Doit commencer par 78, 76, 70, 33 ou 77
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     // Si le champ est vide
  //     if (!control.value.length) {
  //       return { error: true, message: `${controlName} est obligatoire.` };
  //     }

  //     // Vérification du pattern
  //     if (!new RegExp(pattern).test(control.value)) {
  //       return {
  //         error: true,
  //         message: `${controlName} doit commencer par 78, 77, 70, 33, ou 76 et contenir 9 chiffres.`,
  //       };
  //     }

  //     // Vérification de la longueur minimale
  //     if (control.value.length < minLength) {
  //       return {
  //         error: true,
  //         message: `${controlName} doit contenir au moins ${minLength} chiffres.`,
  //       };
  //     }

  //     // Vérification de la longueur maximale
  //     if (control.value.length > maxLength) {
  //       return {
  //         error: true,
  //         message: `${controlName} doit contenir au plus ${maxLength} chiffres.`,
  //       };
  //     }

  //     // Si tout est correct
  //     return null;
  //   };
  // }

  static phoneValidator(
    controlName: string,
    minLength: number,
    maxLength: number
  ) {
    let pattern = '^[0-9+]+(.?[0-9]+)?$';
    /* Add an extra backslash before \d if regex is constructed as a string. There is no need for // at the beginning and end of string if using RegExp  */
    return (control: AbstractControl): ValidationErrors | null => {
      return !control.value.length
        ? { error: true, message: `${controlName} est obligatoire.` }
        : !control.value.match(new RegExp(pattern))
        ? {
            error: true,
            message: `${controlName} ne doit contenir que des chiffres.`,
          }
        : control.value.length < minLength
        ? {
            error: true,
            message: `${controlName} doit contenir au moins  ${minLength} chiffres.`,
          }
        : control.value.length > maxLength
        ? {
            error: true,
            message: `${controlName} doit contenir au plus  ${maxLength} chiffres.`,
          }
        : null;
    };
  }
  /**
   * Vérifie si la valeur d'un champ de formulaire est un nombre et se trouve dans un intervalle spécifique
   * (défini par min et max).
   */
  static checkLimit(min: number, max: number): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      if (c.value && (isNaN(c.value) || c.value < min || c.value > max)) {
        return { range: true };
      }
      return null;
    };
  }

  /**
   * Valide les fichiers
   */
  static file?: File;
  static fileValidator1(nameFiles: FormControl): ValidationErrors | null {
    const file: File = this.files;
    if (!nameFiles.value) {
      return { error: true, message: `Le est obligatoire.` };
    }
    if (this.file?.type != 'image/png') {
      // console.log(this.file?.type)
      return {
        error: true,
        message: ` Le type est invalid.`,
      };
    }

    return null;
  }

  /**
   * Valide les fichiers
   */
  static files: File;
  static fileValidator2(nameFiles: FormControl): ValidationErrors | null {
    const file: File = this.files;

    if (!nameFiles.value) {
      return { error: true, message: `Le est obligatoire.` };
    }
    if (
      file.type == 'image/jpeg' ||
      file.type == 'image/png' ||
      file.type == 'image/jpg'
    ) {
      if (file.size <= 2000000) {
        return {
          error: true,
          message: 'la taille doit etre inferieur à 2Mo',
        };
      }
    } else {
      return {
        error: true,
        message: ` Le type est invalid.`,
      };
    }

    return null;
  }

  /**
   * Valide les URL de site web (https://www.monsite.com, .org, .sn, .net, etc.)
   */
  static urlValidator(controlName: string): ValidatorFn {
    // Expression régulière pour valider les URL avec les extensions spécifiques
    const patternUrl = /^https:\/\/www\.[a-zA-Z0-9-]+\.(com|org|sn|net)$/;

    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return { error: true, message: `${controlName} est obligatoire.` };
      }
      if (!control.value.match(patternUrl)) {
        return {
          error: true,
          message: `${controlName} doit être une URL valide (https://www.monsite.com, .org, .sn, .net).`,
        };
      }
      return null;
    };
  }
}