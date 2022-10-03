using Meets.Models;
using System;

namespace Meets.Controllers.api.dto.Meeting
{
    public class GetTimeTableDTO
    {
        public Guid Id { get; set; }

        public DateTime MeetingDate { get; set; }

        public Guid MeetingId { get; set; }

        public ulong CompanionId { get; set; }

        public ApplicationUser Companion { get; set; }

        /// <summary>
        /// Место встречи. Может быть адресом или вводится в свободной форме
        /// </summary>
        public string Place { get; set; }
    }
}
