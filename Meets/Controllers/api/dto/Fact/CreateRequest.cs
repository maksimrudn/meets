using System.ComponentModel.DataAnnotations;

namespace Meets.Controllers.api.dto.Fact
{
    public class CreateRequest
    {
        [StringLength(300)]
        [Required]
        public string Title { get; set; }

    }
}
