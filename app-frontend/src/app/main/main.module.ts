import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MainComponent} from "./main.component";
import {ProfilesModule} from "../profiles/profiles.module";
import {RouterModule} from "@angular/router";

@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    ProfilesModule,
    RouterModule,
  ]
})
export class MainModule {
}
