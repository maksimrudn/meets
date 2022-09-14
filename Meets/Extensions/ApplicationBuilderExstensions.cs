using Meets.Services;
using Microsoft.AspNetCore.Builder;

namespace Meets.Extensions
{
    public static class ApplicationBuilderExstensions
    {
        public static IApplicationBuilder UseCheckUnsupportedBrowser(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<CheckUnsupportedMiddleware>();
        }
    }
}
