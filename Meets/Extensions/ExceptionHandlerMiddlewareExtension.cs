using Meets.Middlewares;
using Microsoft.AspNetCore.Builder;

namespace Meets.Extensions
{
    public static class ExceptionHandlerMiddlewareExtension
    {
        public static IApplicationBuilder UseCustomExceptionHandler(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<ExceptionHandlerMiddleware>();
        }
    }
}
