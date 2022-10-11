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
using System.Security.Cryptography;
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

            return _generateToken(
                _jwtConfiguration.Issuer,
                _jwtConfiguration.Audience,
                _jwtConfiguration.AccessTokenSecret,
                _jwtConfiguration.AccessTokenExpirationMinutes,
                claims);
        }

        public RefreshToken GenerateRefreshToken()
        {
            using var rngCryptoServiceProvider = new RNGCryptoServiceProvider();
            var rndBytes = new byte[64];
            rngCryptoServiceProvider.GetBytes(rndBytes);

            var refreshToken = new RefreshToken
            {
                Token = Convert.ToBase64String(rndBytes),
                Expires = DateTime.Now.AddDays(_jwtConfiguration.RefreshTokenExpirationDays),
                Created = DateTime.Now
            };

            return refreshToken;
        }

        public ulong ValidateJwtToken(string token)
        {
            if (token is null)
            {
                return 0;
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            //var key = Encoding.ASCII.GetBytes(_jwtConfiguration.AccessTokenSecret);
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtConfiguration.AccessTokenSecret));

            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key, //new SymmetricSecurityKey(key),
                    ValidateIssuer = false, // данные в _jwtConfiguration
                    ValidateAudience = false,////
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var userId = ulong.Parse(jwtToken.Claims.First(x => x.Type == "id").Value);

                return userId;
            }
            catch
            {
                return 0;
            }
        }

        private string _generateToken(string issuer, string audience, string secretKey, double expirationMinutes, IEnumerable<Claim> claims = null)
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
