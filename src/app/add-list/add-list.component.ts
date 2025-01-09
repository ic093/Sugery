import { Component } from '@angular/core';
import { OPService } from '../services/op.service';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; //表單驗證套件

@Component({
  selector: 'app-add-list',
  standalone: false,
  templateUrl: './add-list.component.html',
  styleUrl: './add-list.component.css',
})
export class AddListComponent implements OnInit {
  addForm!: FormGroup; //FormGroup：代表一整個表單。
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
      //用.FormBuilder建立表單groud
      patientId: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{8}$/)], //病歷號規定只能數字，長度為8碼。Validators.pattern：用正規表達式檢查欄位內容。
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
    this.OPService.addSurgery(formData);
    Swal.fire({
      title: '新增成功',
      text: '排程已新增成功',
      icon: 'success',
      confirmButtonText: '確定',
      confirmButtonColor: '#1a394a',
    });
    //重置表單
    this.addForm.reset();
  }
}
