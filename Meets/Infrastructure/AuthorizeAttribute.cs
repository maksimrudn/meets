using Meets.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Linq;

namespace Meets.Infrastructure
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class AuthorizeAttribute: Attribute, IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            bool allowAnoymous = context.ActionDescriptor.EndpointMetadata.OfType<AllowAnonymousAttribute>().Any();
            if (allowAnoymous)
            {
                return;
            }

            var user = (ApplicationUser)context.HttpContext.Items["User"];
            if(user is null)
            {
                context.Result = new JsonResult(new { message = "Не авторизован" }) { StatusCode = StatusCodes.Status401Unauthorized };
            }
        }
    }
}
