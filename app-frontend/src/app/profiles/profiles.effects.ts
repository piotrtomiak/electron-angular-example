import {Injectable} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {Store} from "@ngrx/store";
import {EMPTY} from "rxjs";
import {catchError, tap} from "rxjs/operators";

import {
  createProfile as createProfileCommand,
  deleteProfile as deleteProfileCommand,
  listProfiles as listProfilesQuery,
  updateProfile as updateProfileCommand,
} from "app-common";
import {RootState} from "../app.store";
import {MessagingService} from "../services/messaging/messaging.service";
import {createProfile, deleteProfile, listProfiles, profileCreated, profileDeleted, updateProfile,} from "./profiles.actions";

@Injectable()
export class ProfilesEffects {
  listProfiles$ = createEffect(() =>
          this.actions$.pipe(
              ofType(listProfiles),
              tap(_ => this.messaging.send(listProfilesQuery())),
              catchError(() => EMPTY)
          ),
      {dispatch: false}
  );

  createProfile$ = createEffect(() =>
          this.actions$.pipe(
              ofType(createProfile),
              tap(action => this.messaging.send(createProfileCommand(action.profile))),
              catchError(() => EMPTY)
          ),
      {dispatch: false}
  );

  profileCreated$ = createEffect(() =>
          this.actions$.pipe(
              ofType(profileCreated),
              tap(action => {
                return this.router.navigate([`/profiles/${action.profile.id}`]);
              })
          ),
      {dispatch: false}
  );

  updateProfile$ = createEffect(() =>
          this.actions$.pipe(
              ofType(updateProfile),
              tap(action => this.messaging.send(updateProfileCommand(action.profile))),
          ),
      {dispatch: false}
  );

  deleteProfile$ = createEffect(() =>
          this.actions$.pipe(
              ofType(deleteProfile),
              tap(action => this.messaging.send(deleteProfileCommand(action.id))),
              catchError(() => EMPTY)
          ),
      {dispatch: false}
  );

  profileDeleted$ = createEffect(() =>
          this.actions$.pipe(
              ofType(profileDeleted),
              tap(() => {
                return this.router.navigate(["/profiles"]);
              }),
          ),
      {dispatch: false}
  );

  constructor(private actions$: Actions, private store: Store<RootState>, private route: ActivatedRoute,
              private router: Router, private messaging: MessagingService) {
  }
}
