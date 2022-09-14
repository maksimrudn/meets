using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Meets.Extensions
{
    public static class IHttpContextAccessorExtension
    {
        public static bool IsAuthenticated(this IHttpContextAccessor httpContextAccessor)
        {
            return !string.IsNullOrEmpty( httpContextAccessor.HttpContext.Session.GetString("username"));
        }

        public static bool IsAdmin(this IHttpContextAccessor httpContextAccessor)
        {
            string role = httpContextAccessor.GetRole();

            return string.IsNullOrEmpty( role )? false : role.ToLower().Equals("admin");
        }


        public static string GetUsername(this IHttpContextAccessor httpContextAccessor)
        {
            return httpContextAccessor.HttpContext.Session.GetString("username");
        }

        public static string GetRole(this IHttpContextAccessor httpContextAccessor)
        {
            return httpContextAccessor.HttpContext.Session.GetString("role");
        }
    }
}
