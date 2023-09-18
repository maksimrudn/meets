interface IMeetingStatusItem {
    Title: string
    Code: string
}

export type MeetingStatusItems = 'Invite' | 'Discussion' | 'Confirmed' | 'Canceled';

export const MeetingStatus: Record<MeetingStatusItems, IMeetingStatusItem> = {
    Invite: {
        Title: 'Invite',
        Code: 'Invite'
    },
    Discussion: {
        Title: 'Discussion',
        Code: 'Discussion'
    },
    Confirmed: {
        Title: 'Confirmed',
        Code: 'Confirmed'
    },
    Canceled: {
        Title: 'Canceled',
        Code: 'Canceled'
    }
}