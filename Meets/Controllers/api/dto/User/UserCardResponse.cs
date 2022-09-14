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
    public partial class UserCardResponse
    {        
        public ulong Id { get; set; }

        [Display(Name = "Пол")]
        public Gender? Gender { get; set; }

        [Display(Name = "Дата рождения")]
        public DateTime? BirthDate { get; set; }

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
        public bool LockoutEnabled { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }


        // Признак того, подписан ли пользователь, который зашёл на страницу или нет
        public bool IsSubscribed { get; set; }


        [Display(Name = "Тэги")]
        public List<string> Tags { get; set; }

        public string Description { get; set; }

        public int Growth { get; set; }

        public int Weight { get; set; }

        public int Subscribers { get; set; }

        public int Subscriptions { get; set; }

        public int Meetings { get; set; }

        public double Distance { get; set; }

        public List<Models.Learning> Learnings { get; set; }
        
        public List<Models.Work> Works { get; set; }
        
        public List<Models.Activity> Activities { get; set; }

        public List<Models.Fact> Facts { get; set; }

        public string Company { get; set; }

        public string Job { get; set; }

        public string Specialization { get; set; }
    }
}
