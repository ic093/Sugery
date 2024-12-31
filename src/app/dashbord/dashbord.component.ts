import { Component, OnInit } from '@angular/core';
import { OPService } from '../services/op.service';
@Component({
  selector: 'app-dashbord',
  standalone: false,

  templateUrl: './dashbord.component.html',
  styleUrl: './dashbord.component.css',
})
export class DashbordComponent implements OnInit {
  specialities: string[] = [];

  constructor(public OPService: OPService) {}

  ngOnInit(): void {
    this.OPService.fetchOPData();
    this.OPService.getAllSpeciality().subscribe((data) => {
      this.specialities = data;
      console.log('測試科別', this.specialities);
    });
  }
}
