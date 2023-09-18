namespace Meets.Settings
{
    public class JwtConfiguration
    {
        public double AccessTokenExpirationMinutes { get; set; }

        public double RefreshTokenExpirationDays { get; set; }

        public double RefreshTokenTTL { get; set; }

        public string AccessTokenSecret { get; set; }

        public string Audience { get; set; }

        public string Issuer { get; set; }
    }
}
