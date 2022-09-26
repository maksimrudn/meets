using System;
using System.ComponentModel.DataAnnotations;

namespace Meets.Controllers.api.dto.Message
{
    public class MessageDTO
    {
        [Required]
        public Guid MeetingId { get; set; }

        [Required]
        [Range(1, ulong.MaxValue, ErrorMessage = "ReceiverId не может быть равен 0")]
        public ulong ReceiverId { get; set; }

        [Required]
        public string Text { get; set; }
    }
}
