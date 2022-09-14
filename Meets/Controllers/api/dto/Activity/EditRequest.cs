using System;
using System.ComponentModel.DataAnnotations;

namespace Meets.Controllers.api.dto.Activity
{
    public class EditRequest
    {
        public Guid Id { get; set; }

        [StringLength(300)]
        [Required]
        public string Title { get; set; }
    }
}
