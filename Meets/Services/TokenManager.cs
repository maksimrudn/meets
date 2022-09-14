using Meets.Models;
using Meets.Settings;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Meets.Services
{
    public class TokenManager
    {
        private readonly JwtConfiguration _jwtConfiguration;
        private readonly UserManager<ApplicationUser> _userManager;

        public TokenManager(IOptions<JwtConfiguration> jwtConfiguration, UserManager<ApplicationUser> userManager)
        {
            _jwtConfiguration = jwtConfiguration.Value;
            _userManager = userManager;
        }

        public async Task<string> GenerateAccessToken(ApplicationUser user)
        {
            var roleNames = await _userManager.GetRolesAsync(user);

            var claims = new List<Claim>();
            claims.Add(new Claim("id", user.Id.ToString()));
            claims.Add(new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString())); // аналог NameIdentifier для jwt

            claims.AddRange(roleNames.Select(x => new Claim("Role", x)));

            return this.GenerateToken(
                _jwtConfiguration.Issuer,
                _jwtConfiguration.Audience,
                _jwtConfiguration.AccessTokenSecret,
                _jwtConfiguration.AccessTokenExpirationMinutes,
                claims);
        }

        private string GenerateToken(string issuer, string audience, string secretKey, double expirationMinutes, IEnumerable<Claim> claims = null)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var signingCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer,
                audience,
                claims,
                DateTime.Now,
                DateTime.Now.AddMinutes(expirationMinutes),
                signingCredentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
