using Meets.Domain;
using Meets.Models;
using System;

namespace Meets.Controllers.api.dto.Notifications
{
    public class NotificationDTO
    {
        public Guid Id { get; set; }

        public NotificationType Type { get; set; }

        public DateTime CreatedDate { get; set; }

        public string Message { get; set; }

        public ulong SenderId { get; set; }

        public ApplicationUser Sender { get; set; }

        public ulong ReceiverId { get; set; }

        public ApplicationUser Receiver { get; set; }

        public Guid MeetingId { get; set; }

        public Models.Meeting Meeting { get; set; }
    }
}
