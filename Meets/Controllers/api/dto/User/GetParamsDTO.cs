using System.ComponentModel.DataAnnotations;

namespace Meets.Controllers.api.dto.User
{
    public class GetParamsDTO
    {
        [Range(1, ulong.MaxValue, ErrorMessage = "{0} не может быть равен 0")]
        public ulong UserId { get; set; }
    }
}
