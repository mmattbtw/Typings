import { API } from './API';
import { ObjectId } from 'mongodb';
import { Constants } from '../src/Constants';

export namespace DataStructure {
	export type CollectioName = 'emotes' | 'users' | 'bans' | 'audit' | 'oauth';

	/**
	 * An Emote object, representing an emote created by the app
	 * 
	 * @collection emotes
	 */
	export interface Emote extends MongoDocument {
		name: string;
		owner?: ObjectId | string;
		owner_name?: string;
		private?: boolean;
		global?: boolean;
		mime?: string;
		status: Constants.Emotes.Status;
		tags: string[];
		audit_entries?: AuditLog.Entry[];
	}

	/**
	 * A TwitchUser object, obtained through an OAuth2 connection by an end user
	 * 
	 * @collection users
	 */
	export interface TwitchUser extends MongoDocument {
		rank?: Constants.Users.Rank;
		emotes: (ObjectId | string)[];
		broadcaster_type: string;
		description: string;
		display_name: string;
		id: string;
		login: string;
		offline_image_url: string;
		profile_image_url: string;
		type: string;
		view_count: number;
		email: string;
		created_at: string | Date;
	}

	/**
	 * Banned users
	 * 
	 * @collection bans
	 */
	export interface Ban extends MongoDocument {
		user: ObjectId;
		reason: string;
	}

	/**
	 * AuditLog objects
	 * 
	 * @collection audit
	 */
	export namespace AuditLog {
		export interface Entry extends MongoDocument {
			type: Entry.Type;
			action_user: ObjectId;
			target?: Entry.Target;
			changes: Entry.Change[];
			reason?: string;
		}
		export namespace Entry {
			export interface Change {
				key: string;
				old_value?: any;
				new_value?: any;
			}

			export interface Target {
				type: CollectioName;
				id: ObjectId;
			}

			export enum Type {
				// Range 1-20 (Emote Actions)
				EMOTE_CREATE = 1, // Emote was created
				EMOTE_DELETE = 2, // Emote was deleted
				EMOTE_DISABLE = 3, // Emote was deleted
				EMOTE_EDIT = 4, // Emote was edited

				// Range 21-30 (Authentication)
				AUTH_IN = 21, // User logged in
				AUTH_OUT = 22, // User signed out
	
				// Range 31-50 (User Actions)
				USER_CREATE = 31, // User Created
				USER_DELETE = 32, // User Deleted
				USER_SUSPEND = 33, // User Suspended
				USER_EDIT = 34, // User Edited
				USER_CHANNEL_EMOTE_ADD = 35,
				USER_CHANNEL_EMOTE_REMOVE = 36,

				// Range 51-70 (Administrator Actions)
				APP_MAINTENANCE_MODE = 51, // The app was set in maintenance mode, all endpoints locked for regular users
				APP_ROUTE_LOCK = 52, // An API route was locked
				APP_LOGS_VIEW = 53, // Logs were viewed
				APP_SCALE = 54 // App scaled
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
