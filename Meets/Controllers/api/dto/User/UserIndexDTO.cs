using Meets.Domain;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Meets.Models.User
{
    public class UserIndexDTO
    {
        public ulong Id { get; set; }

        [Display(Name = "Полное имя")]
        [StringLength(100)]
        public string FullName { get; set; }

        [Display(Name = "Город")]
        [StringLength(300)]
        public string City { get; set; }

        [Display(Name = "Роль")]
        public virtual ApplicationRole Role { get; set; }

        public string Avatar { get; set; }

        [Display(Name = "Пол")]        
        public Gender? Gender { get; set; }

        [Display(Name = "Дата рождения")]
        public DateTime? BirthDate { get; set; }

        public string Email { get; set; }

        [Display(Name = "Тэги")]
        public List<string> Tags { get; set; }

        public bool IsSubscribed { get; set; }

        public string Company { get; set; }

        public string Job { get; set; }
    }
}
