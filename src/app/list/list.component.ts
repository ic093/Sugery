import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
@Component({
  selector: 'app-list',
  standalone: false,
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
})
export class ListComponent implements OnInit {
  surgeryList: any[] = [];
  ngOnInit(): void {
    const data = localStorage.getItem('surgeryData');
    if (data) {
      this.surgeryList = [JSON.parse(data)];
    }
  }
}
