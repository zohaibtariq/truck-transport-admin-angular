import {Component, OnInit} from '@angular/core';
import {first} from "rxjs/operators";
import {shareReplay, Subscription} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SettingsService} from "./settings.service";

@Component({
  selector: 'app-emails',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

  time = { hour: 8, minute: 0 };

  updateSettingFormGroup: FormGroup;
  editSettingFormError: any;
  settings: any[];
  private settingSubscription: Subscription;

  constructor(
    private settingsService: SettingsService,
    private fb: FormBuilder,
  ){
  }

  ngOnInit(): void {
    this.initForm();
    this.subscribeSettings();
  }

  ngOnDestroy(){
    this.settingSubscription.unsubscribe();
  }

  subscribeSettings(){
    this.settingSubscription = this.settingsService.settings$.subscribe((settings: any) => {
      this.settings =  settings;
      if(settings && settings.length > 0){
        for (const setting of settings) {
          let key = setting['key'];
          let value = setting['value'];
          let obj = {
            [key]: value
          }
          this.updateSettingFormGroup.patchValue(obj);
        }
      }
    });
    this.settingsService.getSettings();
  }

  initForm() {
    this.updateSettingFormGroup = this.fb.group(
      {
        selectedHourOfDailyEmailSendToDriversWithTenderedLoads: ['', Validators.compose([Validators.required])],
      }
    );
  }

  update(){
    this.editSettingFormError = ''
    if (this.updateSettingFormGroup.valid){
      let allSettings = {
        selectedHourOfDailyEmailSendToDriversWithTenderedLoads: this.updateSettingFormGroup.controls.selectedHourOfDailyEmailSendToDriversWithTenderedLoads.value,
      };
      this.settingsService.updateSettings(allSettings)
      .pipe(shareReplay(), first())
      .subscribe({
        next: (allSettings: any) => {
          this.updateSettingFormGroup.reset();
          this.settingsService.getSettings();
        },
        error: (err: any) => {
          this.editSettingFormError = err.error.message;
          console.log('ERROR', err)
        },
        complete: () => {
        }
      });
    }
  }

}
