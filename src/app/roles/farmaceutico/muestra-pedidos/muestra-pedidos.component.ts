import { Component, OnInit } from '@angular/core';
import { PedidosService } from 'src/app/services/pedidos.service';
import { EmailService } from 'src/app/services/email.service';
import { RemedioService } from 'src/app/services/remedio.service';
import { AlertController } from '@ionic/angular';
import { Remedio } from 'src/app/models/remedio.model';

@Component({
  selector: 'app-muestra-pedidos',
  templateUrl: './muestra-pedidos.component.html',
  styleUrls: ['./muestra-pedidos.component.scss'],
})
export class MuestraPedidosComponent  implements OnInit {
  pedidos: any[]=[];
  listaMedicamento: string='';
  remedios: Remedio[]=[];
  noErrorFlag: boolean=true;
  updateQueueId: any[]=[];
  updateQueueCantidad: number[]=[];


  constructor(
    private pedidosService: PedidosService,
    private emailService: EmailService,
    private alertCtrl: AlertController,
    private remedioService: RemedioService,
  ) { }

  ngOnInit() {
    this.pedidosService.getPedidos().subscribe(data => {
      this.pedidos = data;
    });
    this.remedioService.getRemedios().subscribe(data => {
      this.remedios = data;
    });
  }

 async medicamentoEdit(medicamentoPedido: string, medicamentoCantidad: number){
    for(let i=0; i< this.remedios.length; i++){
      const remedioActual = this.remedios[i];
      if(remedioActual.nombre== medicamentoPedido){
        if(remedioActual.cantidad >= medicamentoCantidad){
          const nuevaCantidad= remedioActual.cantidad-medicamentoCantidad;
          this.updateQueueId.push(remedioActual.id)
          this.updateQueueCantidad.push(nuevaCantidad)
        }
        else{
          this.noErrorFlag=false;
          const alert = await this.alertCtrl.create({
            header: 'Error',
            message: 'No hay suficiente stock',
            buttons: ['OK']
          });
          await alert.present();
        }
      }
    }
  }

  async validarPedido(id:string, pedido:
    {
      nombre: string [],
      cantidad: number [],
      rut: string,
      email: string,
      flag_validacion: boolean,
      nombre_paciente: string
    })
    {
      this.updateQueueId=[];
      this.updateQueueCantidad=[];
     if (pedido.flag_validacion ==! true){
      var listaMedicamento = '';
      for (let i = 0; i < pedido.nombre.length; i++){
        listaMedicamento= listaMedicamento+pedido.nombre[i]+': '+pedido.cantidad[i].toString()+'\n'
        this.medicamentoEdit(pedido.nombre[i], pedido.cantidad[i])
      }
      if(this.noErrorFlag){
        for (let i=0; i<this.updateQueueCantidad.length; i++){
          this.pedidosService.updateCantidad(this.updateQueueId[i], this.updateQueueCantidad[i])
        }
        // La línea de abajo es para llamar la función de notificaciones por correos. Solo se pueden hacer 200 por mes, asi que mejor no activarlo todo el tiempo -Vicente
        this.emailService.sendEmailMedicamento(pedido.nombre_paciente,listaMedicamento,pedido.email)
        this.pedidosService.raiseFlag(id);
      }
      else{
        this.noErrorFlag=true
        return;
      }
     }
     else { 
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'El pedido ya ha sido validado',
        buttons: ['OK']
      });
      await alert.present()
     }
  }
}
