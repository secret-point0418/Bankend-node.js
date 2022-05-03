import { PayloadProps as OrgPayload } from 'types/api/user/getOrganization';
import { PayloadProps as UserPayload } from 'types/api/user/getUser';
import { ROLES } from 'types/roles';

export interface User {
	accessJwt: string;
	refreshJwt: string;
	userId: string;
	email: UserPayload['email'];
	name: UserPayload['name'];
	profilePictureURL: UserPayload['profilePictureURL'];
}

export default interface AppReducer {
	isDarkMode: boolean;
	isLoggedIn: boolean;
	isSideBarCollapsed: boolean;
	currentVersion: string;
	latestVersion: string;
	isCurrentVersionError: boolean;
	isLatestVersionError: boolean;
	user: null | User;
	isUserFetching: boolean;
	isUserFetchingError: boolean;
	role: ROLES | null;
	org: OrgPayload | null;
}
