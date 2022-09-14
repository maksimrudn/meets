namespace Meets.Models.User
{
    public class UserGeodataDTO
    {
        /// <summary>
        /// Id ползователя
        /// </summary>
        public ulong Id { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }
    }
}
