import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {MainComponent} from "./main/main.component";
import {ProfileEditComponent} from "./profiles/profile-edit/profile-edit.component";

const routes: Routes = [
  {
    path: "", component: MainComponent,
    children: [
      {path: "profiles/new", component: ProfileEditComponent},
      {path: "profiles/:id", component: ProfileEditComponent}
    ]
  },
  {path: "**", redirectTo: ""}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {relativeLinkResolution: "legacy"})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
