import { Timestamp } from "firebase/firestore"

export interface IItem {
	name: string
	description: string
	images: string[] // Image URLs stored as array for future expansion
	categories: string[]
	status: ItemStatus
	approvedBy: string
	isApproved: boolean
	isDeleted: boolean
	dateCreated: Timestamp
	dateEdited: Timestamp
	id: string
	userID: string
	isRequestedByUser?: boolean
	itemUserName?: string
	itemEmail?: string
	pickupAddress?: string
	saves: number
	location: ILocation
}

export interface ILocation {
	zipcode: string
	latitude: number
	longitude: number
	country: string
	geohash?: string
}

export enum ItemStatus {
	Available = "Up for Grabs",
	Given = "Donated",
	Rejected = "Rejected",
	Pending = "Pending",
}

export enum RequestStatus {
	Approved = "Approved",
	Requested = "Requested",
	Rejected = "Rejected",
}

export interface IUser {
	name: string
	email: string
	userID: string
	isAdmin: boolean
	isVerified: boolean
	expoPushToken: string
	allowPushNotifications: boolean
	location: ILocation
	profileUrl?: string
}

export interface ISignupInfo {
	name: string
	email: string
	password: string
	confirmPassword: string
	marketingConsent: boolean
	country: string
	zipcode: string
	countryCode: string
}

export interface ILoginInfo {
	email: string
	password: string
}

export interface IMessage {
	id: string
	senderID: string
	dateCreated: Date
	message: string
	itemName: string
	itemImage: string
	itemStatus: ItemStatus
}

export interface IConversation {
	id: string
	itemID: string
	participants: string[]
	recentMessage: IMessage | null
}
