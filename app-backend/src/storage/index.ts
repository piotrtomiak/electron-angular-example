import {EventType, Profile, ProfileCreatedEvent, ProfileDeletedEvent, ProfileUpdatedEvent} from "app-common";
import {EventBus} from "../events/eventBus";
import _ from "lodash";

export class StorageService {
    private nextProfileId = 1;
    private profiles = new Map<number, Profile>();

    constructor(private eventBus: EventBus) {
    }

    public async getProfiles(): Promise<Profile[]> {
        // TODO: An actual implementation should query a database
        const result = [];
        for (const profile of this.profiles.values()) {
            result.push(_.cloneDeep(profile));
        }
        return result;
    }

    public async getProfile(profileId: number): Promise<Profile> {
        // TODO: An actual implementation should query a database
        const result = this.profiles.get(profileId);
        if (!result) {
            throw new Error(`Unknown Profile<id:${profileId}`);
        }
        return _.cloneDeep(result);
    }

    public async updateProfile(profile: Profile) {
        if (!profile.id) {
            throw new Error("Profile<id> must be defined");
        }
        // TODO: An actual implementation should query a database
        if (!this.profiles.has(profile.id)) {
            throw new Error(`Unknown Profile<id:${profile.id}`);
        }
        this.profiles.set(profile.id, _.cloneDeep(profile));
        this.eventBus.broadcast<ProfileUpdatedEvent>(EventType.ProfileUpdated, {profile: _.cloneDeep(profile)});
    }

    public async createProfile(profile: Omit<Profile, "id">) {
        // TODO: An actual implementation should query a database
        const p = _.cloneDeep(profile) as Profile;
        p.id = this.nextProfileId++;
        this.profiles.set(p.id, p);
        this.eventBus.broadcast<ProfileCreatedEvent>(EventType.ProfileCreated, {profile: _.cloneDeep(p)});
    }

    public async deleteProfile(profileId: number) {
        // TODO: An actual implementation should query a database
        if (!this.profiles.has(profileId)) {
            throw new Error(`Unknown Profile<id:${profileId}`);
        }
        this.profiles.delete(profileId);
        this.eventBus.broadcast<ProfileDeletedEvent>(EventType.ProfileDeleted, {profileId});
    }

}

