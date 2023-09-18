using Meets.Domain;
using System;
using System.ComponentModel.DataAnnotations;

namespace Meets.Controllers.api.dto.Account
{
    public class RegisterRequest
    {
        [Required]
        [EmailAddress]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Required]
        [StringLength(100)]
        [Display(Name = "Full name")]
        public string FullName { get; set; }
        public string City { get; set; }
        public string Avatar { get; set; }
        public Gender? Gender { get; set; }
        public DateTime? BirthDate { get; set; }
        public string Tags { get; set; } = "";

        [Required]
        [StringLength(100, ErrorMessage = "Lenghth of password must be minimum {2} and maximum {1} symbols", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Password confirmation")]
        [Compare("Password", ErrorMessage = "Passwords are different.")]
        public string ConfirmPassword { get; set; }
    }
}
