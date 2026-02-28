import { NgModule } from '@angular/core';
import { ResolveStart, RouterModule, Routes } from '@angular/router';
//import { PacientesComponent } from './components/pacientes/pacientes.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { HuespedComponent } from './components/huesped/huesped.component';
import { ReservasComponent } from './components/reservas/reservas.component';
import { HabitacionesComponent } from './components/habitaciones/habitaciones.component';
import { AuthGuard } from './guards/auth.guard';
import { Roles } from './constants/Roles';  
import { UsuariosComponent } from './components/usuarios/usuarios.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], children: [
//    { path: 'pacientes', component: PacientesComponent, canActivate: [AuthGuard] },
    { path: 'huesped', component: HuespedComponent, canActivate: [AuthGuard] },
    { path: 'reservas', component: ReservasComponent, canActivate: [AuthGuard] },
    { path: 'habitaciones', component: HabitacionesComponent, canActivate: [AuthGuard] },
    { path: 'usuarios', component: UsuariosComponent, canActivate: [AuthGuard], data: {roles: [Roles.ADMIN]} }
  ]},
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }