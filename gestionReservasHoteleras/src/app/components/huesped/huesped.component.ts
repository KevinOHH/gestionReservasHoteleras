import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HuespedService } from '../../services/huesped.service';
import { HuespedResponse } from '../../models/Huesped.model';

type Vista = 'lista' | 'formulario' | 'detalle';

@Component({
  selector: 'app-huesped',
  templateUrl: './huesped.component.html',
  styleUrls: ['./huesped.component.css']
})
export class HuespedComponent implements OnInit {

  // ── Estado de vista ──────────────────────────────────────
  vista: Vista = 'lista';
  isEditing = false;
  huespedSeleccionado?: HuespedResponse;
  huespedId?: number;

  // ── Datos ─────────────────────────────────────────────────
  huespedes: HuespedResponse[] = [];

  // ── Formulario ────────────────────────────────────────────
  form!: FormGroup;

  // ── Estado UI ─────────────────────────────────────────────
  loading = false;
  submitting = false;
  errorMsg = '';
  successMsg = '';

  // ── Rol (ajusta según tu AuthService real) ────────────────
  rolUsuario: string = localStorage.getItem('rol') || 'USER';

  constructor(
    private fb: FormBuilder,
    private huespedService: HuespedService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.cargarLista();
  }

  // ── Formulario reactivo ───────────────────────────────────
  buildForm(): void {
    this.form = this.fb.group({
      nombre:       ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      apellido:     ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email:        ['', [Validators.required, Validators.email]],
      telefono:     ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      documento:    ['', [Validators.required]],
      nacionalidad: ['', [Validators.required]]
    });
  }

  // ── LISTA ─────────────────────────────────────────────────
  cargarLista(): void {
    this.loading = true;
    this.errorMsg = '';
    this.huespedService.getAll().subscribe({
      next: (data) => { this.huespedes = data; this.loading = false; },
      error: (err)  => { this.errorMsg = this.resolverError(err); this.loading = false; }
    });
  }

  // ── NAVEGACIÓN ENTRE VISTAS ───────────────────────────────
  irALista(): void {
    this.vista = 'lista';
    this.errorMsg = '';
    this.successMsg = '';
    this.form.reset();
    this.isEditing = false;
    this.huespedSeleccionado = undefined;
  }

  irANuevo(): void {
    this.form.reset();
    this.isEditing = false;
    this.huespedId = undefined;
    this.errorMsg = '';
    this.successMsg = '';
    this.vista = 'formulario';
  }

  irAEditar(h: HuespedResponse): void {
    this.isEditing = true;
    this.huespedId = h.id;
    this.form.patchValue(h);
    this.errorMsg = '';
    this.successMsg = '';
    this.vista = 'formulario';
  }

  irADetalle(h: HuespedResponse): void {
    this.huespedSeleccionado = h;
    this.errorMsg = '';
    this.vista = 'detalle';
  }

  // ── SUBMIT FORMULARIO ─────────────────────────────────────
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    this.errorMsg = '';

    const data = this.form.value;
    const op = this.isEditing
      ? this.huespedService.update(this.huespedId!, data)
      : this.huespedService.create(data);

    op.subscribe({
      next: () => {
        this.successMsg = this.isEditing
          ? 'Huésped actualizado correctamente.'
          : 'Huésped registrado correctamente.';
        this.submitting = false;
        this.cargarLista();
        setTimeout(() => this.irALista(), 1500);
      },
      error: (err) => {
        this.errorMsg = this.resolverError(err);
        this.submitting = false;
      }
    });
  }

  // ── ELIMINAR ──────────────────────────────────────────────
  eliminar(h: HuespedResponse): void {
    if (!confirm(`¿Eliminar a ${h.nombre} ${h.apellido}?`)) return;
    this.huespedService.delete(h.id).subscribe({
      next: () => {
        this.successMsg = 'Huésped eliminado.';
        this.cargarLista();
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: (err) => { this.errorMsg = this.resolverError(err); }
    });
  }

  // ── HELPERS ───────────────────────────────────────────────
  isAdmin(): boolean {
    return this.rolUsuario === 'ADMIN';
  }

  isInvalid(campo: string): boolean {
    const c = this.form.get(campo);
    return !!(c && c.invalid && c.touched);
  }

  iniciales(h: HuespedResponse): string {
    return `${h.nombre.charAt(0)}${h.apellido.charAt(0)}`.toUpperCase();
  }

  private resolverError(err: any): string {
    switch (err.status) {
      case 400: return 'Datos inválidos. Revise los campos.';
      case 401: return 'No autorizado. Inicie sesión nuevamente.';
      case 403: return 'No tiene permisos para esta acción.';
      case 404: return 'Huésped no encontrado.';
      case 409: return err.error?.message || 'Ya existe un huésped activo con ese email, teléfono o documento.';
      default:  return 'Error interno del servidor. Intente más tarde.';
    }
  }
}