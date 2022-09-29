using System;
using System.ComponentModel.DataAnnotations;

namespace Meets.Controllers.api.dto.Message
{
    public class GetMessagesParamsDTO
    {
        //[Range(1, ulong.MaxValue, ErrorMessage = "{0} не может быть равен 0")]
        public Guid MeetingId { get; set; }
    }
}
