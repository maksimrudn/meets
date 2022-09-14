using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Meets.Models
{
    public class Activity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        public DateTime CreatedDate { get; set; }

        public bool IsDeleted { get; set; } = false;

        public ulong UserId { get; set; }

        public virtual ApplicationUser User { get; set; }

        [StringLength(300)]
        [Required]
        public string Title { get; set; }
    }
}
