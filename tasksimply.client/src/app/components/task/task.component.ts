import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskFormComponent } from './task-form.component';
import { TaskService, Task } from '../../services/task.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    CommonModule,
    TaskFormComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-12 col-md-10 col-lg-8">
          <div class="card shadow-lg border-0 rounded-lg mb-4">
            <div class="card-header bg-primary text-white py-4">
              <div class="d-flex justify-content-between align-items-center">
                <h3 class="mb-0">My Tasks</h3>
                <button class="btn btn-light" (click)="showAddTaskForm()" [disabled]="isLoading">
                  <i class="bi bi-plus-lg me-2"></i>Add New Task
                </button>
              </div>
            </div>
            <div class="card-body p-4">
              <div class="task-filters mb-4">
                <div class="btn-group w-100">
                  <button class="btn btn-outline-primary" [class.active]="currentFilter === 'all'" (click)="setFilter('all')" [disabled]="isLoading">All</button>
                  <button class="btn btn-outline-primary" [class.active]="currentFilter === 'pending'" (click)="setFilter('pending')" [disabled]="isLoading">Pending</button>
                  <button class="btn btn-outline-primary" [class.active]="currentFilter === 'in-progress'" (click)="setFilter('in-progress')" [disabled]="isLoading">In Progress</button>
                  <button class="btn btn-outline-primary" [class.active]="currentFilter === 'completed'" (click)="setFilter('completed')" [disabled]="isLoading">Completed</button>
                </div>
              </div>

              <div *ngIf="isLoading" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>

              <!-- Pending Tasks -->
              <div class="task-section mb-4" *ngIf="(currentFilter === 'all' || currentFilter === 'pending') && !isLoading">
                <h4 class="mb-3 text-muted">Pending Tasks</h4>
                <div class="task-list">
                  <ng-container *ngIf="getTasksByStatus('pending') | async as pendingTasks">
                    <div class="card mb-3 task-item" *ngFor="let task of pendingTasks">
                      <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start">
                          <div>
                            <h4 class="card-title mb-2">{{ task.title }}</h4>
                            <p class="card-text text-muted mb-3">{{ task.description }}</p>
                            <div class="d-flex gap-2 align-items-center">
                              <span class="badge bg-warning">Pending</span>
                              <small class="text-muted">Due: {{ task.dueDate | date }}</small>
                            </div>
                          </div>
                          <div class="d-flex gap-2">
                            <button class="btn btn-sm btn-outline-primary" (click)="updateTaskStatus(task, 'in-progress')" [disabled]="isLoading">
                              <i class="bi bi-arrow-right-circle"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-secondary" (click)="editTask(task)" [disabled]="isLoading">
                              <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" (click)="deleteTask(task.id)" [disabled]="isLoading">
                              <i class="bi bi-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ng-container>
                </div>
              </div>

              <!-- In Progress Tasks -->
              <div class="task-section mb-4" *ngIf="(currentFilter === 'all' || currentFilter === 'in-progress') && !isLoading">
                <h4 class="mb-3 text-muted">In Progress Tasks</h4>
                <div class="task-list">
                  <ng-container *ngIf="getTasksByStatus('in-progress') | async as inProgressTasks">
                    <div class="card mb-3 task-item" *ngFor="let task of inProgressTasks">
                      <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start">
                          <div>
                            <h4 class="card-title mb-2">{{ task.title }}</h4>
                            <p class="card-text text-muted mb-3">{{ task.description }}</p>
                            <div class="d-flex gap-2 align-items-center">
                              <span class="badge bg-info">In Progress</span>
                              <small class="text-muted">Due: {{ task.dueDate | date }}</small>
                            </div>
                          </div>
                          <div class="d-flex gap-2">
                            <button class="btn btn-sm btn-outline-success" (click)="updateTaskStatus(task, 'completed')" [disabled]="isLoading">
                              <i class="bi bi-check-circle"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-warning" (click)="updateTaskStatus(task, 'pending')" [disabled]="isLoading">
                              <i class="bi bi-arrow-left-circle"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-secondary" (click)="editTask(task)" [disabled]="isLoading">
                              <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" (click)="deleteTask(task.id)" [disabled]="isLoading">
                              <i class="bi bi-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ng-container>
                </div>
              </div>

              <!-- Completed Tasks -->
              <div class="task-section mb-4" *ngIf="(currentFilter === 'all' || currentFilter === 'completed') && !isLoading">
                <h4 class="mb-3 text-muted">Completed Tasks</h4>
                <div class="task-list">
                  <ng-container *ngIf="getTasksByStatus('completed') | async as completedTasks">
                    <div class="card mb-3 task-item" *ngFor="let task of completedTasks">
                      <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start">
                          <div>
                            <h4 class="card-title mb-2">{{ task.title }}</h4>
                            <p class="card-text text-muted mb-3">{{ task.description }}</p>
                            <div class="d-flex gap-2 align-items-center">
                              <span class="badge bg-success">Completed</span>
                              <small class="text-muted">Due: {{ task.dueDate | date }}</small>
                            </div>
                          </div>
                          <div class="d-flex gap-2">
                            <button class="btn btn-sm btn-outline-info" (click)="updateTaskStatus(task, 'in-progress')" [disabled]="isLoading">
                              <i class="bi bi-arrow-left-circle"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-secondary" (click)="editTask(task)" [disabled]="isLoading">
                              <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" (click)="deleteTask(task.id)" [disabled]="isLoading">
                              <i class="bi bi-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ng-container>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <app-task-form *ngIf="isAddingTask || editingTask" 
      [task]="editingTask"
      [isLoading]="isLoading"
      (close)="closeTaskForm()"
      (save)="onTaskSave($event)">
    </app-task-form>
  `,
  styles: [`
    .card {
      border-radius: 1rem;
    }
    .card-header {
      border-top-left-radius: 1rem !important;
      border-top-right-radius: 1rem !important;
    }
    .task-item {
      transition: all 0.3s ease;
      border: 1px solid rgba(0,0,0,.125);
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 .5rem 1rem rgba(0,0,0,.15);
      }
    }
    .btn-group {
      border-radius: 0.5rem;
      overflow: hidden;
      .btn {
        border-radius: 0;
        &:first-child {
          border-top-left-radius: 0.5rem;
          border-bottom-left-radius: 0.5rem;
        }
        &:last-child {
          border-top-right-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
        }
      }
    }
    .badge {
      padding: 0.5em 1em;
      font-size: 0.875rem;
    }
    .task-section {
      &:not(:last-child) {
        border-bottom: 1px solid rgba(0,0,0,.1);
        padding-bottom: 1.5rem;
      }
    }
  `]
})
export class TaskComponent implements OnInit {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$: Observable<Task[]> = this.tasksSubject.asObservable();
  isAddingTask = false;
  editingTask: Task | null = null;
  currentFilter: 'all' | 'pending' | 'in-progress' | 'completed' = 'all';
  isLoading = false;

  constructor(
    private taskService: TaskService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  showAddTaskForm() {
    this.isAddingTask = true;
  }

  editTask(task: Task) {
    this.editingTask = task;
  }

  closeTaskForm() {
    this.isAddingTask = false;
    this.editingTask = null;
  }

  loadTasks() {
    this.isLoading = true;
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasksSubject.next(tasks);
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  getTasksByStatus(status: string): Observable<Task[]> {
    return this.tasks$.pipe(
      map(tasks => tasks.filter(task => task.status === status))
    );
  }

  setFilter(filter: 'all' | 'pending' | 'in-progress' | 'completed') {
    this.currentFilter = filter;
  }

  updateTaskStatus(task: Task, newStatus: string) {
    const updatedTask = { ...task, status: newStatus };
    this.isLoading = true;
    this.cdr.markForCheck();
  
    this.taskService.updateTask(task.id, updatedTask).subscribe({
      next: () => {
        window.location.reload();
      },
      error: (error) => {
        console.error('Error updating task status:', error);
        this.isLoading = false;
        this.cdr.markForCheck();
        alert('Failed to update task status. Please try again.');
      }
    });
  }
  onTaskSave(taskData: any) {
    if (taskData.id) {
      // Update existing task
      this.taskService.updateTask(taskData.id, taskData).subscribe({
        next: () => {
          window.location.reload();
        },
        error: (error) => {
          console.error('Error updating task:', error);
          alert('Failed to update task. Please try again.');
        }
      });
    } else {
      // Create new task
      this.taskService.createTask(taskData).subscribe({
        next: () => {
          window.location.reload();
        },
        error: (error) => {
          console.error('Error creating task:', error);
          alert('Failed to create task. Please try again.');
        }
      });
    }
  }

  deleteTask(id: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          window.location.reload();
        },
        error: (error) => {
          console.error('Error deleting task:', error);
          alert('Failed to delete task. Please try again.');
        }
      });
    }
  }
} 