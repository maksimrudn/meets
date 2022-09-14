using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Meets.Extensions
{
    public static class UrlHelperExtensions
    {
        private static IHttpContextAccessor HttpContextAccessor;
        public static void Configure(IHttpContextAccessor httpContextAccessor)
        {
            HttpContextAccessor = httpContextAccessor;
        }

        public static string AbsoluteAction(
            this IUrlHelper url,
            string actionName,
            string controllerName,
            object routeValues = null)
        {
            string scheme = HttpContextAccessor.HttpContext.Request.Scheme;
            return url.Action(actionName, controllerName, routeValues, scheme);
        }

        public static string GetDomainName(this IUrlHelper url)
        {
            return HttpContextAccessor.HttpContext.Request.Scheme;
        }
    }
}
