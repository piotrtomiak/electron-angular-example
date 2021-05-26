import {ChangeDetectionStrategy, Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";

import {Profile} from "app-common";

import {RootState} from "../app.store";
import {listProfiles} from "../profiles/profiles.actions";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.less"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent implements OnInit {
  profiles$: Observable<Profile[]>;

  constructor(private route: ActivatedRoute, private router: Router, private store: Store<RootState>) {
    this.profiles$ = store.select(state => state.profiles ?? []);
  }

  ngOnInit(): void {
    this.store.dispatch(listProfiles());
  }

}
