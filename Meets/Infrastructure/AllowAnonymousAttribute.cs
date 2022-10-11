using System;

namespace Meets.Infrastructure
{
    [AttributeUsage(AttributeTargets.Method)]
    public class AllowAnonymousAttribute: Attribute
    {
    }
}
