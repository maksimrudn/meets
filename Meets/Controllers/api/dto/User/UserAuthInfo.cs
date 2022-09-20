using Meets.Models;

namespace Meets.Controllers.api.dto.User
{
    public class UserAuthInfo
    {
        public string UserName { get; set;}

        public ApplicationUser User { get; set; }

        public bool IsAuthenticated { get; set;}

        public bool IsAdmin { get; set; }

        public bool HasGeolocation { get; set; }

        public string City { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }
    }
}
