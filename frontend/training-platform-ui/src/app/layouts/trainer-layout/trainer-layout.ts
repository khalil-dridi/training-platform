import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Sidebar } from './components/sidebar/sidebar';

@Component({
  selector: 'app-trainer-layout',
  imports: [RouterOutlet,Sidebar,Navbar],
  templateUrl: './trainer-layout.html',
  styleUrl: './trainer-layout.scss',
})
export class TrainerLayout {

}
