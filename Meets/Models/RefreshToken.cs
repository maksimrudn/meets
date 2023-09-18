using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Meets.Models
{
    [Owned]
    public class RefreshToken
    {
        [Key]
        [JsonIgnore]
        public ulong Id { get; set; }

        public string Token { get; set; }

        public DateTime Expires { get; set; }

        public DateTime Created { get; set; }

        //public string CreatedByIp { get; set; }

        public DateTime? Revoked { get; set; }

        //public string RevokedByIp { get; set; }

        public string ReplacedByToken { get; set; }

        public string ReasonRevoked { get; set; }

        public bool IsExpired => DateTime.Now >= Expires;

        public bool IsRevoked => Revoked != null;

        public bool IsActive => !IsExpired && !IsRevoked;
    }
}
