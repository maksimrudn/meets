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
        [Display(Name = "Полное имя")]
        public string FullName { get; set; }
        public string City { get; set; }
        public string Avatar { get; set; }
        public Gender? Gender { get; set; }
        public DateTime? BirthDate { get; set; }
        public string Tags { get; set; } = "";

        [Required]
        [StringLength(100, ErrorMessage = "Длинна пароля должна быть минимум {2} и максимум {1} символов.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Пароль")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Подтверждение пароля")]
        [Compare("Password", ErrorMessage = "Пароли не совпадают.")]
        public string ConfirmPassword { get; set; }
    }
}
