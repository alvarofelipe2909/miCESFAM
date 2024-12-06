export interface Remedio {
  id?: string;
  nombre: string;
  descripcion: string;
  cantidad: number;
  imageUrl?: string;
}

export interface UserI {
  rut: string;
  nombre: string;
  email: string;
  apellido: string;
  rol: string;
  especialidad?: string;
  uid: string;
}