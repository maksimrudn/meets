using System.Collections.Generic;

namespace Meets.Controllers.api.dto.Error
{
    public class ErrorResponse
    {
        public IEnumerable<Error> errors { get; set; }

        public ErrorResponse()
        {
            errors = new List<Error>();
        }
    }
}
