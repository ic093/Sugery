import { Component } from '@angular/core';
import { OPService } from '../services/op.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  searchKeyword: string = '';
  constructor(public OPService: OPService) {}

  search(): void {
    this.OPService.searchKeyword(this.searchKeyword);
  }
}
