using Meets.Domain;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace Meets.Models
{
    /// <summary>
    /// Встреча
    /// </summary>
    public class Meeting
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        public DateTime CreateDate { get; set; }

        public DateTime MeetingDate { get; set; }

        public ulong OwnerId { get; set; }

        [JsonIgnore]
        [IgnoreDataMember]
        public virtual ApplicationUser Owner { get; set; }

        
        public ulong TargetId { get; set; }

        [JsonIgnore]
        [IgnoreDataMember]
        public virtual ApplicationUser Target { get; set; }

        public bool IsOnline { get; set; }

        /// <summary>
        /// Место встречи. Может быть адресом или вводится в свободной форме
        /// </summary>
        public string Place { get; set; }

        public MeetingStatus Status { get; set; }

        [JsonIgnore]
        [IgnoreDataMember]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Message> Messages { get; set; }
    }
}
