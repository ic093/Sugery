import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { OPService } from '../services/op.service';
@Component({
  selector: 'app-list',
  standalone: false,
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
})
export class ListComponent implements OnInit {
  surgeryList: any[] = [];
  constructor(private OPService: OPService) {}

  ngOnInit(): void {
    // 訂閱數據流，保持清單更新
    this.OPService.surgeryList.subscribe((data) => {
      this.surgeryList = data;
    });
  }
}
