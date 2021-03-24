
export namespace Constants {
	export namespace Users {
		export enum Rank {
			DEFAULT = 0,
			MODERATOR = 1,
			ADMIN = 100
		}

		export const LOGIN_REGEXP = /^[a-zA-Z0-9_]{4,25}$/;
	}

	export namespace Emotes {
		export enum Status {
			DELETED = -1,
			PROCESSING = 0,
			PENDING = 1,
			DISABLED = 2,
			LIVE = 3
		}

		export const NAME_REGEXP = new RegExp(/^[A-Za-z_\-\(\)\:0-9]{2,100}$/);
		export const MAX_EMOTE_LENGTH = 100;
		export const MIN_EMOTE_LENGTH = 2;
		export const NAME_PATTERN_ERROR = ''.concat(
			'Emote name must be between ',
			`${MIN_EMOTE_LENGTH}-${MAX_EMOTE_LENGTH} characters, `,
			`be alphanumeric, and it may contain underscores and dashes.`
		);

		export type ALLOWED_EXTENSIONS = 'gif' | 'png' | 'webp';
	}
}
