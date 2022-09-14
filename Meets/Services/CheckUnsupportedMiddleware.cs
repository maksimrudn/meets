using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace Meets.Services
{
    /// <summary>
    /// Проверка неподдерживаемого браузера
    /// Не поддерживаются браузеры Internet Explorer всех версий
    /// </summary>
    public class CheckUnsupportedMiddleware
    {
        private readonly RequestDelegate _next;

        public CheckUnsupportedMiddleware(RequestDelegate next)
        {
            this._next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            string userAgent = context.Request.Headers["User-Agent"];

            if (userAgent != null && (userAgent.Contains("Trident") || userAgent.Contains("MSIE")))
            {
                await context.Response.WriteAsync("Ваш браузер не поддерживается системой. Попробуйте использовать другой браузер.");
            }
            else
            {
                await _next(context);
            }
        }
    }
}
