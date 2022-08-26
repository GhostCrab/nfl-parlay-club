import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ParlayPick } from '../../interfaces/parlay-pick.interface';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  form!: FormGroup;
  constructor(
    private readonly formBuilder: FormBuilder,
    public readonly dialogRef: MatDialogRef<FormComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly pick: ParlayPick
  ) {}

  ngOnInit() {
    this.setForm();
  }

  setForm() {
    this.form = this.formBuilder.group({
      user: [this.pick.userID, [Validators.required]],
      game: [this.pick.gameID, [Validators.required]],
      team: [this.pick.teamID, [Validators.required]],
    });
  }

  submit() {
    this.dialogRef.close({ ...this.pick, ...this.form.value });
  }
}