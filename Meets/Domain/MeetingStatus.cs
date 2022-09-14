namespace Meets.Domain
{
    public enum MeetingStatus
    {
        /// <summary>
        /// Приглашение
        /// </summary>
        Invite,

        /// <summary>
        /// Обсуждение
        /// </summary>
        Discussion,

        /// <summary>
        /// Подтверждено
        /// </summary>
        Confirmed,

        /// <summary>
        /// Завершено
        /// </summary>
        Canceled
    }
}
