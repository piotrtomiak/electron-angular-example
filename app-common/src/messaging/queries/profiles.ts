import {v4 as uuidv4} from "uuid";

import {Query, QueryCreator, QueryType} from "./queries";
import {Profile} from "../../model";

export interface ListProfilesResponsePayload {
  profiles: Profile[];
}

export type ListProfilesQuery = Query<QueryType.ListProfiles, { }, ListProfilesResponsePayload>;

export const listProfiles: QueryCreator<ListProfilesQuery> = () => ({
  id: uuidv4(),
  name: QueryType.ListProfiles,
  payload: {}
});
