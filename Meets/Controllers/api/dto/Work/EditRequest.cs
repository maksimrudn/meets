using System;
using System.ComponentModel.DataAnnotations;

namespace Meets.Controllers.api.dto.Work
{
    public class EditRequest
    {
        public Guid Id { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        [StringLength(300)]
        [Required]
        public string Title { get; set; }

        [StringLength(200)]
        public string Post { get; set; }

    }
}
