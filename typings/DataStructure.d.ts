import { API } from './API';
import { ObjectId } from 'mongodb';
import { Constants } from '../src/Constants';

export namespace DataStructure {
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
