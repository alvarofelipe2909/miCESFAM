import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { RemedioService } from 'src/app/services/remedio.service';
import { Remedio } from 'src/app/models/remedio.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-visualizar-medicamentos-paciente',
  templateUrl: './visualizar-medicamentos-paciente.component.html',
  styleUrls: ['./visualizar-medicamentos-paciente.component.scss'],
})
export class VisualizarMedicamentosPacienteComponent implements OnInit {
  form: FormGroup;
  remedios: Remedio[] = [];
  nombre: string []=[];
  cantidad: number []=[];
  userRut: string='';
  userEmail: string='';
  userName: string='';
  searchTerm: string='';
  

  constructor(
    private remedioService: RemedioService,
    private fb: FormBuilder,
    private auths: AuthService,
    private firestore: AngularFirestore,
  
  ){ 
    this.form = this.fb.group({
      output: this.fb.array([])
    })
  }

  get output(){
    return this.form.controls["output"] as FormArray;
  }

  ngOnInit() {
    this.remedioService.getRemedios().subscribe(data => {
      this.remedios = data;
    });
    this.auths.getCurrentUser().subscribe(user => {
      if (user) {
        this.userRut = user.rut;
        this.userEmail = user.email;
        this.userName = user.nombre+' '+user.apellido
      }
    });
    this.addMedicamento();
  }

  addMedicamento(){
    const outputForm= this.fb.group({
      nombre: [''],
      cantidad: ['']
    });
    this.output.push(outputForm);
  }

  deleteMedicamento(index: number){
    this.output.removeAt(index);
  }

  outputSplit(index: number){
    const v_nombre= this.form.value.output[index].nombre
    const v_cantidad= this.form.value.output[index].cantidad
    this.nombre.push(v_nombre)
    this.cantidad.push(v_cantidad)
  }

  async onSubmit(){
    if (this.form.valid){
     for (let i = 0; i < this.form.value.output.length; i++) {
      this.outputSplit(i);
     }
     const pedido ={
      nombre: this.nombre,
      cantidad: this.cantidad,
      rut: this.userRut,
      email: this.userEmail,
      flag_validacion: false,
      nombre_paciente: this.userName
    }
     this.firestore.collection('pedidos').add(pedido)
        .then(() => {
          console.log('Pedido agregada exitosamente');
        })
        .catch(error => {
          console.error('Error al agregar pedido: ', error);
        });
    }
  }

  filtrarRemedios() {
    return this.remedios.filter(remedio => 
      remedio.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // async clickTest(){
  //   const total = this.form.value.output.length;
  //   console.log(this.form.value)
  //   console.log(total)
  // }
}