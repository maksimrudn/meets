namespace Meets.Domain
{
    public enum NotificationType
    {
        /// <summary>
        /// уведомление: отправлено Приглашение
        /// </summary>
        Invite,

        /// <summary>
        /// уведомление: изменение статуса - Обсуждение
        /// </summary>
        Discussion,

        /// <summary>
        /// уведомление: изменение статуса - Подтверждено
        /// </summary>
        Confirmed,

        /// <summary>
        /// уведомление: изменение статуса - Завершено
        /// </summary>
        Canceled,
        
        /// <summary>
        /// уведомление: изменение данных встречи
        /// </summary>
        Edited
    }
}
