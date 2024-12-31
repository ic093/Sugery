import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,

  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  lines = Array(20).fill(0); // 創建 20 條光線

  constructor() {}

  ngOnInit(): void {}
}
