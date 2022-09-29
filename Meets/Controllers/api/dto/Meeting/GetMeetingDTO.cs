using Meets.Domain;
using Meets.Models;
using System;

namespace Meets.Controllers.api.dto.Meeting
{
    public class GetMeetingDTO
    {
        public Guid Id { get; set; }

        public DateTime CreateDate { get; set; }

        public DateTime MeetingDate { get; set; }

        public ulong CompanionId { get; set; }

        public ApplicationUser Companion { get; set; }

        public bool IsOnline { get; set; }

        /// <summary>
        /// Место встречи. Может быть адресом или вводится в свободной форме
        /// </summary>
        public string Place { get; set; }

        public MeetingStatus Status { get; set; }

        public bool IsOwner { get; set; }
    }
}
