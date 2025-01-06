import { Component, OnInit } from '@angular/core';
import { OPService } from '../services/op.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashbord',
  standalone: false,
  templateUrl: './dashbord.component.html',
  styleUrl: './dashbord.component.css',
})
export class DashbordComponent implements OnInit {
  specialities: string[] = [];

  constructor(public OPService: OPService, private router: Router) {}

  ngOnInit(): void {
    this.OPService.fetchOPData();
    this.OPService.getAllSpeciality().subscribe((data) => {
      this.specialities = data;
      console.log('測試科別', this.specialities);
    });
  }
  // 點擊科別，使用路由導航到列表頁
  // goToList(speciality: string): void {
  //   this.router.navigate(['/list'], {
  //     queryParams: { speciality },
  //   });
  // }
}
