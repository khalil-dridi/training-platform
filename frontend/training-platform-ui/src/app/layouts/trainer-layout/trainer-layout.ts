import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Sidebar } from './components/sidebar/sidebar';

@Component({
  selector: 'app-trainer-layout',
  imports: [RouterOutlet, Sidebar, Navbar],
  templateUrl: './trainer-layout.html',
  styleUrl: './trainer-layout.scss',
})
export class TrainerLayout {
  @ViewChild(Sidebar) private sidebar?: Sidebar;

  sidebarCollapsed = false;

  onNavbarMenuToggle(): void {
    if (this.isMobileViewport()) {
      this.sidebar?.toggleMobileNav();
      return;
    }

    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  private isMobileViewport(): boolean {
    return globalThis.matchMedia(`(max-width: ${767}px)`).matches;
  }
}
