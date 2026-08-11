import { Component, inject } from '@angular/core';
import { CurrentUserService } from '../../../../core/services/current-user';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {

  readonly currentUserService = inject(CurrentUserService);

}