using System;
using System.ComponentModel.DataAnnotations;

namespace Meets.Controllers.api.dto.Learning
{
    public class LearningResponse
    {
        public Guid Id { get; set; }

        public bool IsDeleted { get; set; } = false;

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        [StringLength(300)]
        public string Title { get; set; }

    }
}
