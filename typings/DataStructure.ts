import { API } from './API';
import { Long, ObjectId } from 'mongodb';
import { Constants } from '../src/Constants';

export namespace DataStructure {
	export type CollectioName = 'emotes' | 'users' | 'bans' | 'audit' | 'oauth';
	export const NullObjectId = '000000000000000000000000';

	/**
	 * An Emote object, representing an emote created by the app
	 *
	 * @collection emotes
	 */
	export interface Emote {
		id: string;
		name: string;
		owner?: TwitchUser;
		/** @deprecated no longer returned by v2 */
		owner_name?: string;
		owner_id?: ObjectId | string;
		/** @deprecated now visibility  */
		private?: boolean;
		/** @deprecated now visibility  */
		global?: boolean;
		visibility: number;
		channels?: Partial<TwitchUser>[];
		mime?: string;
		status: Constants.Emotes.Status;
		tags: string[];
		audit_entries?: AuditLog.Entry[];
		created_at?: string | Date;
		provider?: Emote.Provider;
		urls?: [string, string][];
		height?: number[];
		width?: number[];
	}
	export namespace Emote {
		export enum Visibility {
			PRIVATE = 1 << 0,
			GLOBAL = 1 << 1,
			HIDDEN = 1 << 2,
			OVERRIDE_BTTV = 1 << 3,
			OVERRIDE_FFZ = 1 << 4,
			OVERRIDE_TWITCH_GLOBAL = 1 << 5,
			OVERRIDE_TWITCH_SUBSCRIBER = 1 << 6
		}

		export type Provider = '7TV' | 'TWITCH' | 'BTTV' | 'FFZ' | 'EMOJI';
	}

	/**
	 * A TwitchUser object, obtained through an OAuth2 connection by an end user
	 *
	 * @collection users
	 */
	export interface TwitchUser extends MongoDocument {
		/** @deprecated - succeeded by role_id  */
		rank?: Constants.Users.Rank;
		role?: DataStructure.Role;
		emotes: Emote[];
		emote_ids: (ObjectId | string)[];
		emote_aliases: string[][];
		owned_emotes: DataStructure.Emote[];
		broadcaster_type: string;
		description: string;
		display_name: string;
		editor_ids: string;
		editor_in?: TwitchUser[];
		editors?: TwitchUser[];
		id: string;
		login: string;
		offline_image_url: string;
		profile_image_url: string;
		type: string;
		view_count: number;
		email: string;
		created_at: string | Date;
		token_version?: string;
		banned?: boolean;
		bans?: Ban[];
		audit_entries: DataStructure.AuditLog.Entry[];
		emote_slots: number;
		broadcast: Broadcast;
		follower_count: number;
	}

	export interface Broadcast {
		id: string;
		title: string;
		thumbnail_url: string;
		viewer_count: number;
		type: string;
		game_name: string;
		game_id: string;
		language: string;
		tags: string[];
		mature: boolean;
		started_at: Date | string;
		user_id: string;
	}

	/**
	 * A Role object, containing bitfields defining allowed and denied permissions
	 *
	 * @collection roles
	 */
	export interface Role {
		id: string;
		name: string;
		color: number;
		allowed: BigInt | Long;
		denied: BigInt | Long;
		position: number;
	}

	export namespace Role {
		export const Permission = {
			/** Allows creating emotes */
			CREATE_EMOTE: BigInt(1) << BigInt(0),
			/** Allows editing own emotes */
			EDIT_EMOTE_SELF: BigInt(1) << BigInt(1),
			/** Allows editing all emotes, including those not owned by client user @elevated */
			EDIT_EMOTE_ALL: BigInt(1) << BigInt(2),

			/** Allows creating reports */
			CREATE_REPORTS: BigInt(1) << BigInt(3),
			/** Allows managing reports @elevated */
			MANAGE_REPORTS: BigInt(1) << BigInt(4),

			/** Allows banning other users @elevated */
			BAN_USERS: BigInt(1) << BigInt(5),

			/** Grants all permissions @elevated */
			ADMINISTRATOR: BigInt(1) << BigInt(6),

			/** Allows managing roles */
			MANAGE_ROLES: BigInt(1) << BigInt(7),
			/** Allows editing users @elevated */
			MANAGE_USERS: BigInt(1) << BigInt(8),

			/** Allows adding and removing editors from own channel */
			MANAGE_EDITORS: BigInt(1) << BigInt(9),

			/** Manage the application stack @elevated */
			MANAGE_STACK: BigInt(1) << BigInt(10)
		};

		export const DEFAULT_PERMISSIONS = Permission.CREATE_EMOTE & Permission.EDIT_EMOTE_SELF & Permission.CREATE_REPORTS & Permission.MANAGE_EDITORS;
	}

	/**
	 * Banned users
	 *
	 * @collection bans
	 */
	export interface Ban extends MongoDocument {
		user_d: string;
		reason: string;
		active: boolean;
		issued_by_id: string;
		expire_at: Date | string;
	}

	/**
	 * AuditLog objects
	 *
	 * @collection audit
	 */
	export namespace AuditLog {
		export interface Entry extends MongoDocument {
			id: string;
			type: Entry.Type;
			timestamp: Date | string;
			action_user: TwitchUser;
			action_user_id: string;
			target?: Entry.Target;
			changes: Entry.Change[];
			reason?: string;
		}
		export namespace Entry {
			export interface Change {
				key: string;
				values?: any[];
				old_value?: any;
				new_value?: any;
			}

			export interface Target {
				type: CollectioName;
				data: string;
				id: ObjectId;
			}

			export enum Type {
				// Range 1-20 (Emote Actions)
				EMOTE_CREATE = 1, // Emote was created
				EMOTE_DELETE, // Emote was deleted
				EMOTE_DISABLE, // Emote was deleted
				EMOTE_EDIT, // Emote was edited

				// Range 21-30 (Authentication)
				AUTH_IN = 20, // User logged in
				AUTH_OUT, // User signed out

				// Range 31-50 (User Actions)
				USER_CREATE = 30, // User Created
				USER_DELETE, // User Deleted
				USER_SUSPEND, // User Suspended
				USER_EDIT, // User Edited
				USER_CHANNEL_EMOTE_ADD,
				USER_CHANNEL_EMOTE_REMOVE,
				USER_UNBAN,
				USER_CHANNEL_EDITOR_ADD,
				USER_CHANNEL_EDITOR_REMOVE,
				USER_CHANNEL_EMOTE_EDIT,

				// Range 51-70 (Administrator Actions)
				APP_MAINTENANCE_MODE = 50, // The app was set in maintenance mode, all endpoints locked for regular users
				APP_ROUTE_LOCK, // An API route was locked
				APP_LOGS_VIEW, // Logs were viewed
				APP_SCALE, // App scaled
				APP_NODE_CREATE, // New k8s worker node created
				APP_NODE_DELETE, // k8s worker node deleted
				APP_NODE_JOIN, // k8s worker node joined to the cluster
				APP_NODE_UNREF, // k8s worker node removed from the cluster
			}
		}
	}

	/**
	 * A bearer token grant object linked to a TwitchUser, obtained from a code exchange of an OAuth2 connection by an end user
	 *
	 * @collection oauth
	 */
	export interface BearerToken extends API.OAuth2.AuthCodeGrant, MongoDocument {
		user_id: string;
	}
}

export interface MongoDocument {
	_id: ObjectId | undefined;
}
