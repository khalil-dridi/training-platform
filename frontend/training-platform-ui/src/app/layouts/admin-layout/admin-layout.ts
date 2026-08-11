import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Sidebar } from './components/sidebar/sidebar';
import { Navbar } from './components/navbar/navbar';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, Sidebar, Navbar],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayout {
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
