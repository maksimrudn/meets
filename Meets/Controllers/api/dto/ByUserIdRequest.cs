using System;
using System.ComponentModel.DataAnnotations;

namespace Meets.Controllers.api.dto
{
    /// <summary>
    /// Универсальный контракт, в котором используется только одно поле UserId
    /// Используется в разных запросах. 
    /// UserId в зависимости от метода api может иметь разный смысл
    /// </summary>
    public class ByUserIdRequest
    {        
        [Required]
        public ulong UserId{ get; set; }
    }
}
