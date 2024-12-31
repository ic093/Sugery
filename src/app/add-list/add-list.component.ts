import { Component } from '@angular/core';
import { OPService } from '../services/op.service';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-list',
  standalone: false,

  templateUrl: './add-list.component.html',
  styleUrl: './add-list.component.css',
})
export class AddListComponent implements OnInit {
  doctors: { doctor: string; speciality: string }[] = [];
  specialities: string[] = [];
  selectSpeciality: string = '';
  Anesthesiologist: string[] = [];
  ScrubNurse: string[] = [];
  formData: any = {
    patientId: '',
    patientName: '',
    speciality: '',
    doctor: '',
    Anesthesiologist: '',
    ScrubNurse: '',
    procedure: '',
    StartTime: '',
    EndTime: '',
  };
  constructor(private OPService: OPService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    //入所有科別
    this.OPService.fetchOPData();
    this.OPService.getAllSpeciality().subscribe((data) => {
      this.specialities = data;
    });
    this.OPService.getAnesth().subscribe((data) => {
      this.Anesthesiologist = data;
      console.log('麻醫', this.Anesthesiologist);
    });
    this.OPService.getScrubNurse().subscribe((data) => {
      this.ScrubNurse = data;
      console.log('刷手', this.ScrubNurse);
    });
  }
  // 當科別發生改變時，根據選中的科別 (speciality) 從服務中取得對應的醫生資料，並更新元件的 doctors 屬性。如果沒有選擇科別，則清空醫生列表
  onSpecialityChange(): void {
    // console.log('科別選擇改變:', this.selectSpeciality);
    // 檢查是否選擇科別：
    // 如果 selectSpeciality 有值： (在模板綁[(ngModel)]="selectSpeciality"中)
    // 調用 getDoctorBySpeciality 方法，獲取對應醫師列表。
    // 將結果存入元件屬性 doctors 中。
    // 如果 selectSpeciality 沒有值（例如用戶清空選項）：
    // 將 doctors 設為空陣列。
    // if (this.selectSpeciality) {
    //   // 1. 調用方法，根據科別篩選醫師
    //   this.OPService.getDoctorBySpeciality(this.selectSpeciality).subscribe(
    //     (data) => {
    //       this.doctors = data;
    //     }
    //   );
    // } else {
    //   this.doctors = [];
    // }
    if (this.formData.speciality) {
      this.OPService.getDoctorBySpeciality(this.formData.speciality).subscribe(
        (data) => {
          this.doctors = data;
        }
      );
    } else {
      this.doctors = [];
    }
  }
  submitFrom(): void {
    const formDataStartTime = this.datePipe.transform(
      this.formData.StartTime,
      'yyyy-MM-dd HH:mm'
    );
    const formDataEndTime = this.datePipe.transform(
      this.formData.EndTime,
      'yyyy-MM-dd HH:mm'
    );
    this.formData.StartTime = formDataStartTime;
    this.formData.EndTime = formDataEndTime;

    localStorage.setItem('surgeryData', JSON.stringify(this.formData));
  }
}
