export namespace API {
	export namespace OAuth2 {
		export interface AuthCodeGrant {
			access_token: string;
			refresh_token: string;
			expires_in: number;
			scope: string[];
			token_type: 'bearer'
		}
	}

	export interface TwitchUser {
		broadcaster_type: string;
		description: string;
		display_name: string;
		id: string;
		login: string;
		offline_image_url: string;
		profile_image_url: string;
		type: string;
		view_count: string;
		email: string;
		created_at: string;
	}
}
