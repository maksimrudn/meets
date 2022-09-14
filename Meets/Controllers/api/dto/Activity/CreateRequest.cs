using System.ComponentModel.DataAnnotations;

namespace Meets.Controllers.api.dto.Activity
{
    public class CreateRequest
    {
        [StringLength(300)]
        [Required]
        public string Title { get; set; }

    }
}
