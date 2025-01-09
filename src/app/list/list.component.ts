import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { OPService } from '../services/op.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-list',
  standalone: false,
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
})
export class ListComponent implements OnInit {
  surgeryList: any[] = [];
  speciality: string = '';
  currentPage: number = 1; // 當前的頁數
  itemsPerPage: number = 5; // 每頁顯示有幾筆

  constructor(private OPService: OPService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // 訂閱數據流，保持清單更新
    this.OPService.surgeryList.subscribe((data) => {
      this.surgeryList = data;
      console.log('測試surgeryList', this.surgeryList);
    });
    // 取得路由中的 `speciality` 查詢參數， 科別歸類
    this.route.queryParamMap.subscribe((params) => {
      this.speciality = params.get('speciality') || '';
      if (this.speciality) {
        this.OPService.getSurgeryBySpecialty(this.speciality).subscribe(
          (data) => {
            this.surgeryList = data;
          }
        );
      }
    });
  }

  //刪除
  deleteSurgery(index: number): void {
    const surgery = this.surgeryList[index];
    const patientId = surgery?.patientId || '此筆資料';
    const patientName = surgery?.patientName || '此筆資料';
    Swal.fire({
      html: `<h2>確定要刪除<span style="color: red;">病歷號為 ${patientId}</span> 嗎?</h2><p>確定刪除 <span style="color: red;">病患姓名: ${patientName} </span> 這筆資料嗎?</p>`,
      icon: 'warning',
      showCancelButton: true, // 顯示取消按鈕
      confirmButtonColor: '#d33', // 確認按鈕顏色
      cancelButtonColor: '#3085d6', // 取消按鈕顏色
      confirmButtonText: '刪除',
      cancelButtonText: '取消',
    }).then((result) => {
      if (result.isConfirmed) {
        const OpenImdex = this.OPService.getSurgeryList().findIndex(
          (item) => item.patientId === surgery.patientId //比較每個記錄的 patientId 是否與當前清單中被點擊刪除的 patientId 相同。
        );
        if (OpenImdex !== -1) {
          this.OPService.deleteSurgery(OpenImdex);
        }
        Swal.fire('刪除成功!');
      }
    });
  }
}
