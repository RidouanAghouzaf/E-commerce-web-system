import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuBarComponent } from "./menu-bar/menu-bar.component";
import { RendezVousComponent } from './rendez-vous/rendez-vous.component';
import { TrustedCompaniesComponent } from './trusted-companies/trusted-companies.component';
import { ToastModule } from 'primeng/toast'; // Import PrimeNG Toast module
import { MessageService } from 'primeng/api'; // Import MessageService
@Component({
  selector: 'app-root',
  standalone: true,
  providers: [MessageService], // Add MessageService as a provider
  imports: [RouterOutlet,MenuBarComponent,RendezVousComponent,TrustedCompaniesComponent,ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'e-commerce';
  constructor(private messageService: MessageService) {}

  showMessage(): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Item added to cart!',
    });
  }
}
