import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { OPService } from '../services/op.service';
import Swal from 'sweetalert2';
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

  //刪除
  deleteSurgery(index: number): void {
    const currentList = this.OPService.getSurgeryList();
    const patientId = currentList[index]?.patientId || '此筆資料';
    Swal.fire({
      title: `確定要刪除病歷號為${patientId}嗎?`,
      icon: 'warning',
      showCancelButton: true, // 顯示取消按鈕
      confirmButtonColor: '#d33', // 確認按鈕顏色
      cancelButtonColor: '#3085d6', // 取消按鈕顏色
      confirmButtonText: '刪除',
      cancelButtonText: '取消',
    }).then((result) => {
      if (result.isConfirmed) {
        this.OPService.deleteSurgery(index);
        Swal.fire('刪除成功');
      }
    });
  }
}
