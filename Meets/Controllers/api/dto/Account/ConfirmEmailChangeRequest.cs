namespace Meets.Controllers.api.dto.Account
{
    public class ConfirmEmailChangeRequest
    {
        public string UserId { get; set; }

        public string Email { get; set; }

        public string Code { get; set; }
    }
}
