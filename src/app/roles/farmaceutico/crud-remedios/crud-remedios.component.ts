import { Component, OnInit } from '@angular/core';
import { RemedioService } from 'src/app/services/remedio.service';
import { Remedio } from 'src/app/models/remedio.model';

@Component({
  selector: 'app-crud-remedios',
  templateUrl: './crud-remedios.component.html',
  styleUrls: ['./crud-remedios.component.scss'],
})
export class CrudRemediosComponent implements OnInit {
  remedio: Remedio = { nombre: '', descripcion: '', cantidad: 0 };
  remedios: Remedio[] = [];
  file: File | null = null;
  isEditing: boolean = false;
  searchTerm: string='';

  constructor(private remedioService: RemedioService) { }

  ngOnInit() {
    this.remedioService.getRemedios().subscribe(data => {
      this.remedios = data;
    });
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
  }

  onSubmit() {
    if (this.isEditing) {
      if (this.file) {
        this.remedioService.addRemedio(this.remedio, this.file).subscribe(() => {
          console.log('Remedio actualizado con éxito');
          this.resetForm();
        }, error => {
          console.error('Error al actualizar remedio:', error);
        });
      } else {
        this.remedioService.updateRemedio(this.remedio.id!, this.remedio).then(() => {
          console.log('Remedio actualizado con éxito');
          this.resetForm();
        }).catch(error => {
          console.error('Error al actualizar remedio:', error);
        });
      }
    } else {
      if (this.file) {
        this.remedioService.addRemedio(this.remedio, this.file).subscribe(() => {
          console.log('Remedio agregado con éxito');
          this.resetForm();
        }, error => {
          console.error('Error al agregar remedio:', error);
        });
      } else {
        console.error('No se ha seleccionado ningún archivo');
      }
    }
  }

  editRemedio(remedio: Remedio) {
    this.remedio = { ...remedio };
    this.isEditing = true;
  }

  deleteRemedio(id: string) {
    this.remedioService.deleteRemedio(id).then(() => {
      console.log('Remedio eliminado con éxito');
    }).catch(error => {
      console.error('Error al eliminar remedio:', error);
    });
  }

  resetForm() {
    this.remedio = { nombre: '', descripcion: '', cantidad: 0 };
    this.file = null;
    this.isEditing = false;
  }

  filtrarRemedios() {
    return this.remedios.filter(remedio => 
      remedio.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}