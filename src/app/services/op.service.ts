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

  private surgeryListSubject = new BehaviorSubject<any[]>([]);
  public surgeryList = this.surgeryListSubject.asObservable(); // 手術清單
  constructor(public http: HttpClient) {
    this.loadSurgeryData();
  }
  // fetchOPData負責從 /data.json 文件中獲取資料，並更新到 OPSubject 中。
  fetchOPData(): void {
    this.http.get<any>(this.url).subscribe({
      next: (data) => {
        console.log('Fetched Data:', data);
        this.OPSubject.next(data);
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      },
    });
  }
  getOPData(): Observable<any> {
    //給予一個變數，保護BehaviorSubject不被直接修改。
    //並返回OPDate
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
  //根據科別（Speciality）篩選出符合條件的醫師，並返回一個包含醫師名稱和科別的陣列
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
          console.log('沒有抓到麻醫資料 ');
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
        console.log('Scrub Nurse Data:', scrubNurse);
        return scrubNurse.map((item: any) => item.name);
      })
    );
  }

  loadSurgeryData(): void {
    const data = JSON.parse(localStorage.getItem('surgeryData') || '[]');
    //從localStorage中存在surgeryData的資料取出
    this.surgeryListSubject.next(Array.isArray(data) ? data : []);
  }

  // 新增手術記錄。
  addSurgery(data: any): void {
    const currentList = this.surgeryListSubject.getValue();
    //currentList 為目前的手術記錄陣列。
    const updatedList = [...currentList, data];
    this.surgeryListSubject.next(updatedList);
    localStorage.setItem('surgeryData', JSON.stringify(updatedList));
  }

  getSurgeryList(): any[] {
    return this.surgeryListSubject.getValue();
  }

  //刪除功能
  deleteSurgery(data: number): void {
    const currentList = this.surgeryListSubject.getValue();
    currentList.splice(data, 1);
    this.surgeryListSubject.next([...currentList]);
    localStorage.setItem('surgeryData', JSON.stringify(currentList));
  }
  //根據選定的科別，filter出對應的手術清單
  getSurgeryBySpecialty(speciality: string): Observable<any[]> {
    return this.surgeryList.pipe(
      map((data) => data.filter((item) => item.speciality === speciality))
    );
  }
  // 編輯
  updateSurgery(updatedData: any): void {
    const currentList = this.surgeryListSubject.getValue();
    const index = currentList.findIndex(
      (item) => item.patientId === updatedData.patientId
    );
    if (index !== -1) {
      currentList[index] = updatedData; //更新數據
      this.surgeryListSubject.next([...currentList]); //推回更新
      localStorage.setItem('surgeryData', JSON.stringify(currentList)); //更新localStorage
    }
  }
  searchKeyword(query: string): void {
    const currentList = JSON.parse(localStorage.getItem('surgeryData') || '[]');
    if (query) {
      const keyWord = currentList.filter((item: any) =>
        ['patientId', 'patientName', 'speciality', 'doctor'].some((key) =>
          item[key].toLowerCase().includes(query.toLowerCase())
        )
      );
      this.surgeryListSubject.next(keyWord);
    } else {
      this.surgeryListSubject.next(currentList);
    }
  }
}
