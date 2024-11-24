import { Routes } from '@angular/router';
import { RendezVousComponent } from './rendez-vous/rendez-vous.component';

export const routes: Routes = [
    {
        path: 'RendezVous',
        component: RendezVousComponent
    },
    {
        path: '*',
        redirectTo: '',
        pathMatch: 'full'
    }
];
