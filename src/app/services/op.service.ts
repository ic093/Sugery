import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OPService {
  public url = '/data.json';

  private OPSubject = new BehaviorSubject<any>(null);
  public OPDate = this.OPSubject.asObservable();
  //   OPDate 的作用：
  // 將 BehaviorSubject 轉換為只讀的 Observable。
  // 讓其他元件可以通過訂閱 OPDate 來獲取資料更新。
  constructor(public http: HttpClient) {}
  // fetchOPData負責從 /data.json 文件中獲取資料，並更新到 OPSubject 中。
  fetchOPData(): void {
    this.http.get<any>(this.url).subscribe({
      next: (data) => {
        console.log('Fetched Data:', data); // 檢查是否成功獲取資料
        this.OPSubject.next(data); // 更新 BehaviorSubject，將獲取的資料通過 BehaviorSubject 傳播給所有訂閱者，觸發更新。
      },

      error: (err) => {
        console.error('Error fetching data:', err); // 捕捉錯誤
      },
    });
  }
  //提供一個街口，可以訂閱
  // 保護 BehaviorSubject，不允許元件直接修改其值，只能通過 Observable 訂閱。元件或服務可以調用此方法訂閱資料流，而不直接接觸 BehaviorSubject。
  getOPData(): Observable<any> {
    return this.OPDate;
  }
  // 提取所有醫生的科別 (speciality)，並移除重複的科別
  getAllSpeciality(): Observable<string[]> {
    return this.OPDate.pipe(
      map((data) => {
        if (!data || !data.Doctor || !Array.isArray(data.Doctor)) {
          return [];
        }
        const doctors = data.Doctor;
        return doctors
          .map((item: any) => item.speciality) //// 提取所有科別
          .filter(
            //濾掉重複的科別
            (speciality: any, index: any, self: any) =>
              self.indexOf(speciality) === index
          );
      })
    );
  }
  // 根據給定的科別（Speciality），從醫師數據中篩選出符合該科別的醫師，並返回這些醫師的名字和科別的 Observable。
  getDoctorBySpeciality(
    Speciality: string
  ): Observable<{ doctor: string; speciality: string }[]> {
    return this.OPDate.pipe(
      map((data) => {
        if (!data || !data.Doctor || !Array.isArray(data.Doctor)) {
          return [];
        }
        return data.Doctor.filter(
          (item: any) => item.speciality === Speciality
        ).map((item: any) => ({
          doctor: item.name,
          speciality: item.speciality,
        }));
      })
    );
  }
  //麻醉科醫師
  getAnesth(): Observable<string[]> {
    return this.OPDate.pipe(
      map((data) => {
        if (
          !data ||
          !data.Anesthesiologist ||
          !Array.isArray(data.Anesthesiologist)
        ) {
          console.log('NO Anesthesiologist');
          return [];
        }
        const Anesth = data.Anesthesiologist;
        return Anesth.map((item: any) => item.name);
      })
    );
  }
  // 刷手
  getScrubNurse(): Observable<string[]> {
    return this.OPDate.pipe(
      map((data) => {
        if (
          !data ||
          !data['scrub nurse'] ||
          !Array.isArray(data['scrub nurse'])
        ) {
          console.log('NO ScrubNurse');
          return [];
        }
        const scrubNurse = data['scrub nurse'];
        console.log('Scrub Nurse Data:', scrubNurse); // 調試輸出
        return scrubNurse.map((item: any) => item.name);
      })
    );
  }
}
