using System;
using System.ComponentModel.DataAnnotations;

namespace Meets.Controllers.api.dto.Meeting
{
    /// <summary>
    /// Приглашение на встречу
    /// </summary>
    public class MeetingRequest
    {
        public ulong TargetId { get; set; }

        public bool IsOnline { get; set; }

        /// <summary>
        /// Место встречи. Может быть адресом или вводится в свободной форме
        /// </summary>
        public string Place { get; set; }

        public string Message { get; set; }
    }
}
