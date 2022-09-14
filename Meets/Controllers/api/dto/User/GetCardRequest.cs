using System.ComponentModel.DataAnnotations;

namespace Meets.Controllers.api.dto.User
{
    /// <summary>
    /// Парамеры по которым запрашивается информация о пользователе
    /// </summary>
    public class GetCardRequest
    {
        [Range(1, ulong.MaxValue, ErrorMessage = "{0} не может быть равен 0")]
        public ulong UserId { get; set; }
    }
}
