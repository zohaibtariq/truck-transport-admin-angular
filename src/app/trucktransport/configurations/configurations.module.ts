import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InlineSVGModule} from "ng-inline-svg-2";
import {FormsModule, NgModel, ReactiveFormsModule} from "@angular/forms";
import {ChargesComponent} from "./charges/charges.component";
import {GoodsComponent} from "./goods/goods.component";
import {ConfigurationsRoutingModule} from "./configurations-routing.module";
import {ConfigurationsComponent} from "./configurations.component";
import { SettingsComponent } from './settings/settings.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    ConfigurationsComponent,
    ChargesComponent,
    GoodsComponent,
    SettingsComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    InlineSVGModule,
    ReactiveFormsModule,
    ConfigurationsRoutingModule,
    NgbModule,
  ],
  exports: [
    ReactiveFormsModule
  ]
})
export class ConfigurationsModule {}
