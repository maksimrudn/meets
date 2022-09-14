using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Meets.Domain;

namespace Meets.Models
{
    public class Subscribtion 
    {
        public DateTime CreateDate { get; set; }

        public ulong OwnerId { get; set; }    

        public virtual ApplicationUser Owner { get; set; }

        public ulong TargetId { get; set; }

        public virtual ApplicationUser Target { get; set; }        
    }
}