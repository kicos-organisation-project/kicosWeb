export class User {
  constructor(
    public id?: number,
    public first_name?: string,
    public last_name?: string,
    public address?: string | null,
    public email?: string,
    public pseudo?: string,
    public password?: string,
    public date_of_birthday?: Date,
    public phone_number?: string,
    public picture?: string,
    public cni?: string,
    public etat?: string,
    public created_at?: Date,
    public created_by?: string,
    public updated_at?: Date,
    public updated_by?: string,
    public deleted_at?: Date | null,
    public deleted_by?: string | null
  ) {
    this.id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.address = address;
    this.email = email;
    this.pseudo = pseudo;
    this.password = password;
    this.date_of_birthday = date_of_birthday;
    this.phone_number = phone_number;
    this.picture = picture;
    this.cni = cni;
    this.etat = etat;
    this.created_at = created_at;
    this.created_by = created_by;
    this.updated_at = updated_at;
    this.updated_by = updated_by;
    this.deleted_at = deleted_at;
    this.deleted_by = deleted_by;
  }
}