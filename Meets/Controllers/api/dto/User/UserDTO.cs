using Meets.Domain;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Meets.Models.User
{
    public class UserDTO
    {
        public ulong Id { get; set; }

        [Display(Name = "Полное имя")]
        [StringLength(100)]
        public string FullName { get; set; }

        [Display(Name = "Город")]
        [StringLength(300)]
        public string City { get; set; }

        public string Avatar { get; set; }

        [Display(Name = "Пол")]        
        public Gender? Gender { get; set; }

        [Display(Name = "Дата рождения")]
        public DateTime? BirthDate { get; set; }


        [Display(Name = "Телефон")]
        [StringLength(50)]
        public string PhoneNumber { get; set; }

        public string Email { get; set; }

        public bool EmailConfirmed { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public bool HasGeolocation { get { return Latitude != 0; } }

        [Display(Name = "Тэги")]
        public List<string> Tags { get; set; }

        public string Description { get; set; }

        public int Growth { get; set; }

        public int Weight { get; set; }

        public int Subscribers { get; set; }

        public int Subscriptions { get; set; }

    }
}
