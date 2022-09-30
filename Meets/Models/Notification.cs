using Meets.Domain;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace Meets.Models
{
    public class Notification
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        public NotificationType Type { get; set; }

        public DateTime CreatedDate { get; set; }

        public string Message { get; set; }

        public ulong SenderId { get; set; }

        [JsonIgnore]
        [IgnoreDataMember]
        public virtual ApplicationUser Sender { get; set; }

        public ulong ReceiverId { get; set; }

        [JsonIgnore]
        [IgnoreDataMember]
        public virtual ApplicationUser Receiver { get; set; }

        public Guid MeetingId { get; set; }

        [JsonIgnore]
        [IgnoreDataMember]
        public virtual Meeting Meeting { get; set; }
    }
}
