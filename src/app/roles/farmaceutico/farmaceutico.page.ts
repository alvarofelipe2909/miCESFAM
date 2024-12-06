import { Component, OnInit } from '@angular/core';
import { RemedioService } from 'src/app/services/remedio.service';
import { Remedio } from 'src/app/models/remedio.model';

@Component({
  selector: 'app-farmaceutico',
  templateUrl: './farmaceutico.page.html',
  styleUrls: ['./farmaceutico.page.scss'],
})
export class FarmaceuticoPage implements OnInit {
  remedios: Remedio[] = [];
  searchTerm: string='';

  constructor(private remedioService: RemedioService) { }

  ngOnInit() {
    this.remedioService.getRemedios().subscribe(data => {
      this.remedios = data;
    });
  }

  filtrarRemedios() {
    return this.remedios.filter(remedio => 
      remedio.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
