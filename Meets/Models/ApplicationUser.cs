using Meets.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using System.Security.Claims;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;

namespace Meets.Models
{
    public class ApplicationUser : IdentityUser<ulong>
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public ApplicationUser()
        {
            Tags = "";
        }

        //public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager)
        //{
        //    // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
        //    var userIdentity = await manager.CreateAsync(this, DefaultAuthenticationTypes.ApplicationCookie);

        //    userIdentity.AddClaim(new Claim("WebApplication.Models.RegisterViewModel.NameIdentifier", NameIdentifier));
        //    userIdentity.AddClaim(new Claim("WebApplication.Models.RegisterViewModel.Email", Email));

        //    userIdentity.AddClaim(new Claim("PhotoLink", (PhotoLink == null) ? "empty" : PhotoLink));


        //    return userIdentity;
        //}

        [Display(Name = "Полное имя")]
        [StringLength(100)]
        public string FullName { get; set; }

        [Display(Name = "Должность")]
        [StringLength(100)]
        public string Job { get; set; }

        [Display(Name = "Компания")]
        [StringLength(100)]
        public string Company { get; set; }

        [Display(Name = "Сфера деятельности")]
        [StringLength(100)]
        public string Specialization { get; set; }

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

        [Display(Name = "Тэги")]
        public string Tags { get; set; } = "";

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public string Description { get; set; }

        public int Growth { get; set; }

        public int Weight { get; set; }

        public bool IsInvitable { get; set; } = true;

        public bool IsSearchable { get; set; } = true;

        public bool IsGeoTracking { get; set; } = false;

        public string Telegram { get; set; }


        /// <summary>
        /// Подписчики
        /// </summary>
        [JsonIgnore]
        [IgnoreDataMember]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Subscribtion> Subscribers { get; set; }

        /// <summary>
        /// Подписки
        /// </summary>
        [JsonIgnore]
        [IgnoreDataMember]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Subscribtion> Subscribtions { get; set; }


        [JsonIgnore]
        [IgnoreDataMember]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Meeting> OutgoingMeetings { get; set; }

        [JsonIgnore]
        [IgnoreDataMember]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Meeting> IncomingMeetings { get; set; }
        
        [JsonIgnore]
        [IgnoreDataMember]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Learning> Learnings { get; set; }

        [JsonIgnore]
        [IgnoreDataMember]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Work> Works { get; set; }

        [JsonIgnore]
        [IgnoreDataMember]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Models.Activity> Activities { get; set; }

        [JsonIgnore]
        [IgnoreDataMember]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Fact> Facts { get; set; }
    }
}
