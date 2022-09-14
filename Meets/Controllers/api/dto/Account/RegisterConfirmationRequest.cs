using System.ComponentModel.DataAnnotations;

namespace Meets.Controllers.api.dto.Account
{
    public class RegisterConfirmationRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
