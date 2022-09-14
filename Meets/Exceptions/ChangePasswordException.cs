using Microsoft.AspNetCore.Identity;
using System;

namespace Meets.Exceptions
{
    public class ChangePasswordException: Exception
    {
        public IdentityResult Result { get; set; }

        public ChangePasswordException(IdentityResult result)
        {
            Result = result;
        }   
    }
}
