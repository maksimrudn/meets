using System;
using System.ComponentModel.DataAnnotations;

namespace Meets.Controllers.api.dto.Meeting
{
    /// <summary>
    /// Приглашение на встречу
    /// </summary>
    public class MeetingRequest
    {
        [Required]
        public ulong TargetId { get; set; }

        [Required]
        public DateTime MeetingDate { get; set; }

        [Required]
        public bool IsOnline { get; set; }

        /// <summary>
        /// Место встречи. Может быть адресом или вводится в свободной форме
        /// </summary>
        [Required]
        public string Place { get; set; }

        [Required]
        public string Message { get; set; }
    }
}
