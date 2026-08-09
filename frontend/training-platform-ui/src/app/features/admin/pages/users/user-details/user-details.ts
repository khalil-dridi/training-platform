import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../../services/user';
import { UserResponse } from '../../../../user/models/user-response.model';


@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [RouterLink ],
  templateUrl: './user-details.html',
  styleUrl: './user-details.scss',
})
export class UserDetails implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);

  user: UserResponse | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.loadUser(id);
  }

  private loadUser(id: number): void {
    this.userService.getUserById(id).subscribe({
      next: (response) => {
        this.user = response.data;
      },
      error: (error) => {
        console.error('Failed to load user', error);
      },
    });
  }
}