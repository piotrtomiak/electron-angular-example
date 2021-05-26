import {Profile} from "app-common";
import {RouterReducerState} from "@ngrx/router-store";

export interface RootState {
  profiles?: Profile[];
  router: RouterReducerState;
}
