import { Component, OnInit } from '@angular/core';
import { OPService } from '../services/op.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-edit-list',
  standalone: false,
  templateUrl: './edit-list.component.html',
  styleUrl: './edit-list.component.css',
})
export class EditListComponent implements OnInit {
  editForm!: FormGroup;
  specialities: string[] = [];
  Anesthesiologist: string[] = [];
  ScrubNurse: string[] = [];
  doctors: { doctor: string; speciality: string }[] = [];
  id: any;
  constructor(
    private OPService: OPService,
    private route: ActivatedRoute,
    private FormBuilder: FormBuilder,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.editForm = this.FormBuilder.group({
      patientId: [{ value: '', disabled: true }, Validators.required],
      patientName: ['', [Validators.required]], //姓名必填
      speciality: ['', [Validators.required]],
      doctor: ['', [Validators.required]],
      Anesthesiologist: ['', [Validators.required]],
      ScrubNurse: ['', [Validators.required]],
      procedure: ['', [Validators.required]],
      StartTime: ['', [Validators.required]],
      EndTime: ['', [Validators.required]],
    });
    //取得路由參數
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id') || '';
      const surgery = this.OPService.getSurgeryList().find(
        (item) => item.patientId === this.id
      );
      if (surgery) {
        this.editForm.patchValue(surgery); //如果找到對應的資料，使用 patchValue 將資料更新到表單中
        if (surgery.speciality) {
          this.OPService.getDoctorBySpeciality(surgery.speciality).subscribe(
            (data) => {
              this.doctors = data;
            }
          );
        }
      }
    });
    this.OPService.getAllSpeciality().subscribe((data) => {
      this.specialities = data;
    });
    this.OPService.getAnesth().subscribe((data) => {
      this.Anesthesiologist = data;
    });
    this.OPService.getScrubNurse().subscribe((data) => {
      this.ScrubNurse = data;
    });
  }
  //保存編輯資料
  saveForm(): void {
    const updatedData = {
      ...this.editForm.getRawValue(), //抓原生資料
      patientId: this.id, //ID不變
    };
    this.OPService.updateSurgery(updatedData);
    Swal.fire('更新成功!', '', 'success').then(() => {
      this.router.navigate(['/list']);
    });
  }
  onSpecialityChange(): void {
    const speciality = this.editForm.get('speciality')?.value;
    if (speciality) {
      this.OPService.getDoctorBySpeciality(speciality).subscribe((data) => {
        this.doctors = data; // 更新對應的醫生列表
      });
    } else {
      this.doctors = []; // 如果科別為空，清空醫生列表
    }
  }
}
