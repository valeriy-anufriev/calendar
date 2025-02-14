import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { Appointment } from '../../interfaces/appointment.interface';
import { timeRangeValidator } from '../../validators/time-range.validator';

@Component({
  selector: 'app-appointment-dialog',
  standalone: true,
  imports: [
    MatButton,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatFormField,
    MatInput,
    MatLabel,
    MatSuffix,
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    CommonModule,
    MatError,
  ],
  templateUrl: './appointment-dialog.component.html',
  styleUrl: './appointment-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentDialogComponent {
  readonly appointmentForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Appointment,
  ) {
    this.appointmentForm = this.buildForm();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    if (this.appointmentForm.valid) {
      this.dialogRef.close({ ...this.appointmentForm.value, uuid: this.data.uuid });
    }
  }

  onDeleteClick(): void {
    this.dialogRef.close({ remove: true, uuid: this.data.uuid });
  }

  private buildForm(): FormGroup {
    return this.formBuilder.group({
      title: [this.data.title || '', Validators.required],
      date: [this.data.date, Validators.required],
      startTime: [this.data.startTime || '', Validators.required],
      endTime: [this.data.endTime || '', Validators.required],
    }, { validators: timeRangeValidator });
  }
}
