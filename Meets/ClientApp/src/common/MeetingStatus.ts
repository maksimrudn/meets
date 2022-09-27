interface IMeetingStatusItem {
    Title: string
    Code: string
}

export type MeetingStatusItems = 'Invite' | 'Discussion' | 'Confirmed' | 'Canceled';

export const MeetingStatus: Record<MeetingStatusItems, IMeetingStatusItem> = {
    Invite: {
        Title: 'Приглашение',
        Code: 'Invite'
    },
    Discussion: {
        Title: 'Обсуждение',
        Code: 'Discussion'
    },
    Confirmed: {
        Title: 'Подтверждено',
        Code: 'Confirmed'
    },
    Canceled: {
        Title: 'Завершено',
        Code: 'Canceled'
    }
}