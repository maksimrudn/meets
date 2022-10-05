import { Activity } from "../activity/Activity"
import { Fact } from "../fact/Fact"
import { Learning } from "../learning/Learning"
import { Work } from "../work/Work"

export default class UserCardResponse {
    id: any
    gender: any
    birthDate: any
    avatar: any
    city: any
    company: any
    job: any
    specialization: any
    fullName: any
    lockoutEnabled: any
    tags: any
    latitude: any
    longitude: any
    description: any
    growth: any
    weight: any
    subscribers: any
    subscriptions: any
    learnings: Learning[] = []
    works: Work[] = []
    activities: Activity[] = []
    facts: Fact[] = []
    distance: any
    isSubscribed: boolean = false
    friendRequestIsRejected: any
    meetings: number = 0
    isInvited: boolean = false
}