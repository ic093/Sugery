import { Component } from '@angular/core';
import { OPService } from '../services/op.service';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-list',
  standalone: false,
  templateUrl: './add-list.component.html',
  styleUrl: './add-list.component.css',
})
export class AddListComponent implements OnInit {
  addForm!: FormGroup;
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
  constructor(
    private OPService: OPService,
    private datePipe: DatePipe,
    private FormBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.addForm = this.FormBuilder.group({
      patientId: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{8}$/)], //病歷號規定只能數字，長度為8碼
      ],
      patientName: ['', [Validators.required]], //姓名必填
      speciality: ['', [Validators.required]],
      doctor: ['', [Validators.required]],
      Anesthesiologist: ['', [Validators.required]],
      ScrubNurse: ['', [Validators.required]],
      procedure: ['', [Validators.required]],
      StartTime: ['', [Validators.required]],
      EndTime: ['', [Validators.required]],
    });

    //入所有科別
    this.OPService.fetchOPData();
    this.OPService.getAllSpeciality().subscribe((data) => {
      this.specialities = data;
    });
    this.OPService.getAnesth().subscribe((data) => {
      this.Anesthesiologist = data;
      // console.log('麻醫', this.Anesthesiologist);
    });
    this.OPService.getScrubNurse().subscribe((data) => {
      this.ScrubNurse = data;
      // console.log('刷手', this.ScrubNurse);
    });
  }
  // 當科別發生改變時，根據選中的科別 (speciality) 從服務中取得對應的醫生資料，並更新元件的 doctors 屬性。如果沒有選擇科別，則清空醫生列表

  // 這段程式碼的作用是根據表單中選擇的「科別」(speciality)，動態獲取對應的醫師列表，並更新元件的 doctors 屬性。
  onSpecialityChange(): void {
    const speciality = this.addForm.get('speciality')?.value;
    if (speciality) {
      this.OPService.getDoctorBySpeciality(speciality).subscribe((data) => {
        this.doctors = data;
      });
    } else {
      this.doctors = [];
    }
  }
  submitForm(): void {
    if (this.addForm.invalid) {
      Swal.fire('錯誤', '請確保表單輸入正確！', 'error');
      return;
    }

    const formData = { ...this.addForm.value };
    formData.starTime = this.datePipe.transform(
      formData.starTime,
      'yyyy-MM-dd HH:mm'
    );
    formData.EndTime = this.datePipe.transform(
      formData.EndTime,
      'yyyy-MM-dd HH:mm'
    );

    // const formDataStartTime = this.datePipe.transform(
    //   this.formData.StartTime,
    //   'yyyy-MM-dd HH:mm'
    // );
    // const formDataEndTime = this.datePipe.transform(
    //   this.formData.EndTime,
    //   'yyyy-MM-dd HH:mm'
    // );
    // this.formData.StartTime = formDataStartTime;
    // this.formData.EndTime = formDataEndTime;
    // 使用 OPService 新增資料
    this.OPService.addSurgery(formData);

    // this.formData = {
    //   patientId: '',
    //   patientName: '',
    //   speciality: '',
    //   doctor: '',
    //   Anesthesiologist: '',
    //   ScrubNurse: '',
    //   procedure: '',
    //   StartTime: '',
    //   EndTime: '',
    // };

    Swal.fire({
      title: '新增成功',
      text: '排程已新增成功',
      icon: 'success',
      confirmButtonText: '確定',
      confirmButtonColor: '#1a394a', // 修改按鈕背景顏色
    });
    //重置表單
    this.addForm.reset();
  }
}
