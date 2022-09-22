using System.ComponentModel.DataAnnotations;

namespace Meets.Controllers.api.dto.User
{
    public class ProfileSettingsDTO
    {
        public string Email { get; set; }

        public bool EmailConfirmed { get; set; }

        public bool IsInvitable { get; set; } = true;

        public bool IsSearchable { get; set; } = true;

        public bool IsGeoTracking { get; set; } = false;

        [Display(Name = "Должность")]
        [StringLength(100)]
        public string Job { get; set; }

        [Display(Name = "Компания")]
        [StringLength(100)]
        public string Company { get; set; }

        [Display(Name = "Сфера деятельности")]
        [StringLength(100)]
        public string Specialization { get; set; }

        public string Telegram { get; set; }
    }
}
