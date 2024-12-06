import { Component, OnInit } from '@angular/core';
import { RecetaService } from 'src/app/services/receta.service';
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-medico-recetas',
  templateUrl: './medico-recetas.component.html',
  styleUrls: ['./medico-recetas.component.scss'],
})
export class MedicoRecetasComponent implements OnInit {
  receta: any = {
    nombrePaciente: '',
    rutPaciente: '',
    descripcion: '',
    fecha: ''
  };
  recetas: any[] = [];
  pacientes: any[] = [];
  filteredPacientes: any[] = [];
  isLoading: boolean = true;
  searchTerm: string = '';

  constructor(
    private recetaService: RecetaService,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.cargarDatos();
  }

  async cargarDatos() {
    this.isLoading = true;
    try {
      await Promise.all([
        this.cargarRecetas(),
        this.cargarPacientes()
      ]);
    } finally {
      this.isLoading = false;
    }
  }

  async cargarRecetas() {
    this.recetaService.getRecetas().subscribe(data => {
      this.recetas = data.map(receta => ({
        ...receta,
        fecha: this.formatFirestoreDate(receta.fecha)
      }));
    });
  }

  async cargarPacientes() {
    this.recetaService.getPacientes().subscribe(data => {
      this.pacientes = data;
      this.filteredPacientes = data;
    });
  }

  filterPacientes(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredPacientes = this.pacientes.filter(paciente => 
      paciente.rut.toLowerCase().includes(query) ||
      paciente.nombre.toLowerCase().includes(query)
    );
  }

  filterRecetas() {
    return this.recetas.filter(receta =>
      receta.nombrePaciente.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      receta.rutPaciente.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  seleccionarPaciente(paciente: any) {
    this.receta.rutPaciente = paciente.rut;
    this.receta.nombrePaciente = paciente.nombre;
    this.filteredPacientes = [];
  }

  formatFirestoreDate(firestoreDate: any): string {
    if (firestoreDate && firestoreDate.seconds) {
      const date = new Date(firestoreDate.seconds * 1000);
      return format(date, 'dd/MM/yyyy HH:mm');
    }
    return format(new Date(), 'dd/MM/yyyy HH:mm'); // Usar la fecha actual si la fecha de Firestore no es válida
  }

  loadImageAsBase64(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL('image/png');
          resolve(dataURL);
        } else {
          reject(new Error('Failed to get canvas context'));
        }
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  async generatePDF() {
    const doc = new jsPDF();
    
    // Cargar y agregar logo
    const logoBase64 = await this.loadImageAsBase64('assets/icon/favicon.png');
    doc.addImage(logoBase64, 'PNG', 10, 10, 30, 30);
  
    // Encabezado
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('CESFAM Peñalolen', 50, 20);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Dirección: Calle Falsa 123, Ciudad', 50, 25);
    doc.text('Teléfono: (22) 456-7890', 50, 30);
  
    // Línea divisoria
    doc.line(10, 40, 200, 40);
  
    // Título de la receta
    doc.setFontSize(16);
    doc.setFont('times', 'bold');
    doc.text('Receta Médica', 105, 50, { align: 'center' });
  
    // Información del paciente
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Información del Paciente:', 10, 60);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nombre: ${this.receta.nombrePaciente}`, 10, 70);
    doc.text(`RUT: ${this.receta.rutPaciente}`, 10, 80);
    doc.text(`Fecha: ${format(new Date(this.receta.fecha), 'dd/MM/yyyy HH:mm:ss')}`, 10, 90);
    

    // Descripción
    doc.setFont('helvetica', 'bold');
    doc.text('Descripción:', 10, 100);
    doc.setFont('helvetica', 'normal');
    const medicamentos = this.receta.descripcion.split('\n');
    medicamentos.forEach((medicamento: any, index: number) => {
      doc.text(`${index + 1}. ${medicamento}`, 10, 110 + (index * 10), { maxWidth: 180 });
    });
  
    // Línea divisoria final
    doc.line(10, 260, 200, 260);
  
    // Pie de página
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Esta receta es válida únicamente con la firma del médico.', 10, 270);
  
    return doc.output('blob');
  }

  async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'top'
    });
    toast.present();
  }

  async onSubmit() {
    if (!this.validarFormulario()) {
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Generando receta...',
      spinner: 'circular'
    });
    await loading.present();

    try {
      this.receta.fecha = new Date().toISOString();
      const pdfBlob = await this.generatePDF();
      await this.recetaService.addReceta(this.receta, pdfBlob).toPromise();
      await this.presentToast('Receta generada con éxito');
      this.limpiarFormulario();
    } catch (error) {
      console.error('Error:', error);
      await this.presentToast('Error al generar la receta', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  validarFormulario(): boolean {
    if (!this.receta.nombrePaciente || !this.receta.rutPaciente || !this.receta.descripcion) {
      this.presentToast('Por favor complete todos los campos', 'warning');
      return false;
    }
    return true;
  }

  limpiarFormulario() {
    this.receta = {
      nombrePaciente: '',
      rutPaciente: '',
      descripcion: '',
      fecha: ''
    };
  }

  async deleteReceta(id: string) {
    try {
      await this.recetaService.deleteReceta(id);
      await this.presentToast('Receta eliminada con éxito');
    } catch (error) {
      console.error('Error:', error);
      await this.presentToast('Error al eliminar la receta', 'danger');
    }
  }
}