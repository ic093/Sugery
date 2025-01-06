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
  private surgeryListSubject = new BehaviorSubject<any[]>([]); //管理內部數據
  public surgeryList: Observable<any[]> =
    this.surgeryListSubject.asObservable(); //Observable對外提供
  constructor(public http: HttpClient) {
    this.loadSurgeryData();
    //這行程式碼呼叫了 loadSurgeryData() 方法。
    //目的：在服務被建立時，立刻從 localStorage 中載入手術數據，並將其存入 surgeryListSubject。
  }
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
  // 手術數據管理
  loadSurgeryData(): void {
    //一開始不是先setItem，因為首次運行時，loadSurgeryData將localStorage的內容解析空陣列，利用這個空陣列為初始值傳給BehaviorSubject
    //後續取數據時，取出已存入的內容，當應用再次加載時（例如重新整理頁面），localStorage 中已經有存入的數據。這種設計模式能確保應用在「無數據」和「有數據」兩種情況下都能正常運行，並且避免程式拋出錯誤
    const data = JSON.parse(localStorage.getItem('surgeryData') || '[]');
    //從localStorage中存在surgeryData的資料取出
    this.surgeryListSubject.next(Array.isArray(data) ? data : []); //更新 BehaviorSubject，呼叫 next() 方法，將數據推送給所有訂閱此 BehaviorSubject 的訂閱者。確保所有使用這個數據的元件（或服務）能即時同步。
    // loadSurgeryData()的功用為:從 localStorage 中載入手術數據,並將其存入 surgeryListSubject。
  }
  // 新增手術記錄，並將其同步更新到本地儲存和訂閱者。
  addSurgery(data: any): void {
    const currentList = this.surgeryListSubject.getValue(); //使用 BehaviorSubject 的 getValue() 方法，取得目前儲存的手術記錄清單。
    // currentList 是目前的手術記錄陣列。
    // 確保新增的資料包含 patientName

    const updatedList = [...currentList, data]; //利用 展開運算符 (...) 創建一個新的陣列：將 currentList 的內容複製到新的陣列。
    // 將新增的 data 附加到新陣列的末尾。不可變性（Immutability）：
    // 不直接修改原始的 currentList，而是創建新的陣列。
    // 避免意外修改原始資料結構，提升程式的安全性和可除錯性。
    this.surgeryListSubject.next(updatedList); //更新 BehaviorSubject，將更新後的手術記錄清單推送給所有訂閱此 BehaviorSubject 的訂閱者。
    localStorage.setItem('surgeryData', JSON.stringify(updatedList)); //將更新後的清單 updatedList 轉換為 JSON 格式的字串，並存入瀏覽器的 localStorage 中。
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
}
