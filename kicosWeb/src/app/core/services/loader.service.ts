import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  constructor() {}

  // Objet de tableau de loader (tous les loader de la plateforme sont ds la tab any)
  // tous les loader supprimer sont mis ds la tab delete)
  loaders : any = {
    delete: [],
    any: [],
  };

  // Permet d'ajouter un loader
  add(id: any, where = 'any') {
    // Ajoute ds le any si where != delete. l'id est une ch.c (Ex : formAddUser)
    if (!this.loaders[where].includes(id)) {
      this.loaders[where].push(id);
    }
  }

  // Permet de supprimer un loader spécifique
  remove(id: any, where = 'any') {
    this.loaders[where] = this.loaders[where].filter((item : any) => item != id);
  }

  // Permet de vider le tab des loader ajouter
  clear(where = 'any') {
    this.loaders[where] = [];
  }

  // Permet de savoir si c en loader ou pas avant den ajouter.
  isLoading(id: any, where = 'any') {
    return this.loaders[where].includes(id);
  }
}
