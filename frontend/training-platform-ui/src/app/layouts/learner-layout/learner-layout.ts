import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Navbar } from './components/navbar/navbar';
import { Sidebar } from './components/sidebar/sidebar';

@Component({
  selector: 'app-learner-layout',
  imports: [RouterOutlet, Sidebar, Navbar],
  templateUrl: './learner-layout.html',
  styleUrl: './learner-layout.scss',
})
export class LearnerLayout {
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
