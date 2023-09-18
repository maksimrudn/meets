using Meets.Data;
using Meets.Infrastructure;
using Meets.Services;
using Meets.Settings;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System.Linq;
using System.Threading.Tasks;

namespace Meets.Middlewares
{
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;
        //private readonly TokenManager _tokenManager;
        //private readonly JwtConfiguration _jwtConfiguration;
        //private readonly ApplicationDbContext _db;

        public JwtMiddleware(RequestDelegate next /*TokenManager tokenManager, ApplicationDbContext db*/)
        {
            _next = next;
            //_tokenManager = tokenManager;
            //_db = db;
        }

        public async Task Invoke(HttpContext context, TokenManager tokenManager, ApplicationDbContext db/*IUserService userService, IJwtUtils jwtUtils*/)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
            var userId = tokenManager.ValidateJwtToken(token); //jwtUtils.ValidateJwtToken(token);

            if(userId != 0)
            {
                // проверка если user is null
                context.Items["User"] = await db.Users.FindAsync(userId); //userService.GetUserById(userId);
            }

            await _next(context);
        }
    }
}
