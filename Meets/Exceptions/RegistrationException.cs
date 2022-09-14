using System;
using System.Collections.Generic;

namespace Meets.Exceptions
{
    public class RegistrationException : Exception
    {
        public ICollection<string> Errors { get; set; } = new List<string>();

        public RegistrationException(IEnumerable<string> errors)
        {
            foreach (var error in errors)
            {
                Errors.Add(error);
            }
        }
    }
}