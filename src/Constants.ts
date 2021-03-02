
export namespace Constants {
	export namespace Users {
		export enum Rank {
			DEFAULT = 0,
			MODERATOR = 1,
			ADMIN = 100
		}
	}

	export namespace Emotes {
		export enum Status {
			DELETED = -1,
			PROCESSING = 0,
			PENDING = 1,
			DISABLED = 2,
			LIVE = 3
		}
	}
}
