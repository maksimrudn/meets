using System;

namespace Meets.Controllers.api.dto.Meeting
{
    public class EditMeetingRequest
    {

        public Guid Id { get; set; }

        public DateTime MeetingDate { get; set; }

        public string Place { get; set; }
    }
}
