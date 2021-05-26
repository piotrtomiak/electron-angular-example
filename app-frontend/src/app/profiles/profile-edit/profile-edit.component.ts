import {Component, OnDestroy, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {combineLatest, Subscription} from "rxjs";

import {Profile} from "app-common";

import {RootState} from "../../app.store";
import {createProfile, deleteProfile, updateProfile} from "../profiles.actions";

@Component({
  selector: "profile-edit",
  templateUrl: "./profile-edit.component.html",
  styleUrls: ["./profile-edit.component.less"]
})
export class ProfileEditComponent implements OnInit, OnDestroy {
  form: FormGroup;
  currentProfile?: Profile;
  isUpdatingProfile = false;

  profileSubscription: Subscription;

  constructor(private route: ActivatedRoute, private router: Router,
              private store: Store<RootState>, private formBuilder: FormBuilder) {
    const profiles$ = store.select(state => state.profiles);

    this.form = formBuilder.group({
      name: ["", [Validators.required, Validators.minLength(1)]],
      surname: ["", [Validators.required, Validators.minLength(1)]],
    });

    this.profileSubscription = combineLatest([route.params, profiles$]).subscribe(([params, profiles]) => {
      const parsedProfileId = parseInt(params.id, 10);
      const profileId = !isNaN(parsedProfileId) ? parsedProfileId : null;

      this.currentProfile = (profiles ?? []).find(p => p.id === profileId);

      this.form.setValue({
        name: this.currentProfile?.name ?? "",
        surname: this.currentProfile?.surname ?? "",
      });
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.profileSubscription.unsubscribe();
  }

  onSaveClicked() {
    if (this.form.valid) {
      this.isUpdatingProfile = true;

      const rawValue = this.form.getRawValue();

      const profile = {
        id: this.currentProfile?.id,
        name: rawValue.name,
        surname: rawValue.surname,
      };

      if (profile.id === undefined) {
        this.store.dispatch(createProfile({profile}));
      } else {
        this.store.dispatch(updateProfile({profile: profile as Profile}));
      }
    }
  }

  onDeleteClicked() {
    if (this.currentProfile !== undefined && this.currentProfile.id !== undefined) {
      this.isUpdatingProfile = true;
      this.store.dispatch(deleteProfile({id: this.currentProfile.id}));
    }
  }

  onCancelClicked() {
    return this.router.navigate([`/profiles/${this.currentProfile?.id}`]);
  }
}
