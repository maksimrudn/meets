using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Meets.Controllers.api.dto.User
{
    public class ChangePasswordRequest
    {
        [Required(ErrorMessage ="Поле Пароль должно быть заполнено")]
        [DataType(DataType.Password)]
        [Display(Name = "Пароль")]
        public string OldPassword { get; set; }

        [Required(ErrorMessage = "Поле Новый пароль должно быть заполнено")]
        [StringLength(100, ErrorMessage = "Пароль должен быть длинной как мининмум {2} символов", MinimumLength = 8)]
        [DataType(DataType.Password)]
        [Display(Name = "Новый пароль")]
        public string NewPassword { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Подтверждение пароля")]
        [Compare("NewPassword", ErrorMessage = "Пароли отличаются")]
        public string ConfirmPassword { get; set; }

    }
}
