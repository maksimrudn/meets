using System.ComponentModel.DataAnnotations;

namespace Meets.Controllers.api.dto.Message
{
    public class GetReceiverInfoParamsDTO
    {
        [Range(1, ulong.MaxValue, ErrorMessage = "{0} не может быть равен 0")]
        public ulong TargetUserId { get; set; }
    }
}
