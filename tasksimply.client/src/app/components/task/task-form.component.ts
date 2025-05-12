import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Task } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="modal fade show" style="display: block;" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">{{ isEditing ? 'Edit Task' : 'Add New Task' }}</h5>
            <button type="button" class="btn-close btn-close-white" (click)="onCancel()" [disabled]="isLoading"></button>
          </div>
          <div class="modal-body p-4">
            <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
              <div class="form-floating mb-3">
                <input type="text" class="form-control" id="title" formControlName="title" placeholder="Task Title" [disabled]="isLoading">
                <label for="title">Task Title</label>
                <div class="text-danger" *ngIf="taskForm.get('title')?.hasError('required') && taskForm.get('title')?.touched">
                  Title is required
                </div>
              </div>

              <div class="form-floating mb-3">
                <textarea class="form-control" id="description" formControlName="description" placeholder="Task Description" style="height: 100px" [disabled]="isLoading"></textarea>
                <label for="description">Description</label>
                <div class="text-danger" *ngIf="taskForm.get('description')?.hasError('required') && taskForm.get('description')?.touched">
                  Description is required
                </div>
              </div>

              <div class="form-floating mb-3">
                <select class="form-select" id="status" formControlName="status" [disabled]="isLoading">
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <label for="status">Status</label>
              </div>

              <div class="form-floating mb-3">
                <input type="date" class="form-control" id="dueDate" formControlName="dueDate" [disabled]="isLoading">
                <label for="dueDate">Due Date</label>
                <div class="text-danger" *ngIf="taskForm.get('dueDate')?.hasError('required') && taskForm.get('dueDate')?.touched">
                  Due date is required
                </div>
              </div>

              <div class="d-grid gap-2">
                <button class="btn btn-primary btn-lg" type="submit" [disabled]="!taskForm.valid || isLoading">
                  <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {{ isEditing ? 'Update Task' : 'Add Task' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show"></div>
  `,
  styles: [`
    .modal-content {
      border-radius: 1rem;
      border: none;
    }
    .modal-header {
      border-top-left-radius: 1rem;
      border-top-right-radius: 1rem;
    }
    .form-floating > .form-control {
      padding: 1rem 0.75rem;
      height: calc(3.5rem + 2px);
    }
    .form-floating > label {
      padding: 1rem 0.75rem;
      height: auto;
    }
    .form-floating > .form-select {
      padding: 1rem 0.75rem;
      height: calc(3.5rem + 2px);
    }
    .form-floating > textarea.form-control {
      height: 100px;
      padding-top: 1.625rem;
    }
    .form-floating > textarea.form-control + label {
      padding-top: 0.5rem;
    }
    .form-floating > .form-control:focus ~ label,
    .form-floating > .form-control:not(:placeholder-shown) ~ label,
    .form-floating > .form-select ~ label {
      transform: scale(.85) translateY(-0.5rem) translateX(0.15rem);
      background-color: white;
      padding: 0 0.25rem;
      height: auto;
    }
  `]
})
export class TaskFormComponent {
  @Input({ required: false }) task: Task | null = null;
  @Input({ required: false }) isLoading: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  taskForm: FormGroup;
  isEditing: boolean = false;

  constructor(private fb: FormBuilder) {
    const today = new Date().toISOString().split('T')[0];
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.maxLength(1000)]],
      status: ['pending', Validators.required],
      dueDate: [today, Validators.required]
    });
  }

  ngOnInit() {
    if (this.task) {
      this.isEditing = true;
      this.taskForm.patchValue({
        title: this.task.title,
        description: this.task.description,
        status: this.task.status,
        dueDate: new Date(this.task.dueDate).toISOString().split('T')[0]
      });
    }
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      // Convert the date string to a Date object
      formValue.dueDate = new Date(formValue.dueDate);
      if (this.isEditing && this.task) {
        formValue.id = this.task.id;
      }
      this.save.emit(formValue);
      this.close.emit();
    }
  }

  onCancel() {
    this.close.emit();
  }
} 