import {ListProfilesQuery} from "app-common";

import {createQueryHandler} from "../index";

export const listProfilesQueryHandler = createQueryHandler<ListProfilesQuery>(async (context) => {
  return {profiles: await context.services.storage.getProfiles()};
});
