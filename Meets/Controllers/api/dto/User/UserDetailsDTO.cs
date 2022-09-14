using Meets.Domain;
using Meets.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Meets.Controllers.api.dto.User
{
    public partial class UserDetailsDTO
    {        
        public ulong Id { get; set; }

        [Display(Name = "Логин")]
        [StringLength(100)]
        public string Username { get; set; }

        [Display(Name = "Пароль")]
        [StringLength(300)]
        public string Password { get; set; }

        [Display(Name = "Пол")]
        [StringLength(300)]
        public Gender? Gender { get; set; }

        [Display(Name = "Дата рождения")]
        public DateTime? BirthDate { get; set; }


        // TODO разобраться зачем нужно это поле и желательно заменить на username
        [Display(Name = "Полное имя")]
        [Required]
        [StringLength(100)]
        public string FullName { get; set; }

        [Display(Name = "Фото")]
        [StringLength(300)]
        public string Avatar { get; set; }

        [Display(Name = "Город")]
        [StringLength(300)]
        public string City { get; set; }

        [StringLength(100)]
        public string Email { get; set; }


        [Display(Name = "Телефон")]
        [StringLength(50)]
        public string Phone { get; set; }

        [Display(Name = "Статус")]
        public bool Status { get; set; }

        [Display(Name = "Роль")]
        [ForeignKey("Role")]
        public ulong RoleId { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        [Display(Name = "Роль")]
        public virtual ApplicationRole Role { get; set; }

        public int OrganizedCount { get; set; }

        public int GoesCount { get; set; }

        public int VisitCount { get; set; }

        public bool IsFriend { get; set; }

        public bool FriendRequestIsRejected { get; set; }

        [Display(Name = "Тэги")]
        public List<string> Tags { get; set; }

        public string Description { get; set; }

        public int Growth { get; set; }

        public int Weight { get; set; }

        public int Subscribers { get; set; }

        public int Subscriptions { get; set; }

        public string Work { get; set; }

        public string Post { get; set; }

        public double Distance { get; set; }

        public List<Models.Learning> Learnings { get; set; }
        
        public List<Models.Work> Works { get; set; }
        
        public List<Models.Activity> Activities { get; set; }

        public List<Models.Fact> Facts { get; set; }

    }
}
