import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { PublicFooter } from './components/footer/footer';
import { PublicNavbar } from './components/navbar/navbar';

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, PublicNavbar, PublicFooter],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.scss',
})
export class PublicLayout {}
