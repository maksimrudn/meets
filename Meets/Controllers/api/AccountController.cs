using Meets.Controllers.api.dto.Account;
using Meets.Services;
using Meets.Data;
using Meets.Exceptions;
using Meets.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Linq;
using System.Text;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Meets.Extensions;
using Meets.Models.User;
using AutoMapper;
using Meets.Settings;
using Microsoft.Extensions.Options;
using Meets.Infrastructure;
using System.Collections.Generic;

namespace Meets.Controllers.api
{
    [Authorize]
    [Area("api")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly TokenManager _tokenManager;
        private readonly ApplicationDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private IWebHostEnvironment _env;
        private IMapper _mapper;
        private readonly JwtConfiguration _jwtConfiguration;

        public AccountController(TokenManager tokenManager,
                                ApplicationDbContext db,
                                UserManager<ApplicationUser> userManager,
                                SignInManager<ApplicationUser> signInManager,
                                IMapper mapper,
                                IWebHostEnvironment env,
                                IOptions<JwtConfiguration> jwtConfiguration)
        {
            _tokenManager = tokenManager;
            _db = db;
            _userManager = userManager;
            _signInManager = signInManager;
            _env = env;
            _mapper = mapper;
            _jwtConfiguration = jwtConfiguration.Value;
        }

        [AllowAnonymous]
        [HttpPost("[area]/[controller]/[action]")]
        public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
        {
            
            // todo реализовано не совсем как в изначальных формах identity, необходимо максимально приблизить
            var user = await _userManager.FindByEmailAsync(request.Email);

            if (user == null)
            {
                throw new Exception("Пользователь не найден");
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);

            if (!result.Succeeded)
                throw new Exception("Неправильный логин или пароль");


            var jwt = await _tokenManager.GenerateAccessToken(user);
            var refreshToken = _tokenManager.GenerateRefreshToken();
            user.RefreshTokens.Add(refreshToken);

            _removeOldRefreshTokens(user);

            _db.Update(user);
            await _db.SaveChangesAsync();

            _setTokenCookie(refreshToken.Token);

            return new LoginResponse() { AccessToken = jwt, RefreshToken = refreshToken.Token };
            
        }

        [AllowAnonymous]
        [HttpPost("[area]/[controller]/[action]")]
        public async Task<LoginResponse> RefreshToken()
        {
            var refreshTokenFromCookie = Request.Cookies["refreshToken"];
            var user = _getUserByRefreshToken(refreshTokenFromCookie);
            var refreshToken = user.RefreshTokens.Single(x => x.Token == refreshTokenFromCookie);

            if (refreshToken.IsRevoked)
            {
                _revokeDescendantRefreshTokens(refreshToken, user, $"Attempted reuse of revoked ancestor token {refreshTokenFromCookie}");
                _db.Update(user);
                await _db.SaveChangesAsync();
            }

            if (!refreshToken.IsActive)
            {
                throw new Exception("Invalid token");
            }

            var newRefreshToken = _rotateRefreshToken(refreshToken);
            user.RefreshTokens.Add(newRefreshToken);

            _removeOldRefreshTokens(user);

            _db.Update(user);
            await _db.SaveChangesAsync();

            var jwtToken = await _tokenManager.GenerateAccessToken(user);

            _setTokenCookie(newRefreshToken.Token);

            return new LoginResponse { AccessToken = jwtToken, RefreshToken = newRefreshToken.Token };
        }

        [HttpPost("[area]/[controller]/[action]")]
        public async Task<IActionResult> RevokeToken(RevokeTokenRequest model)
        {
            var token = model.Token ?? Request.Cookies["refreshToken"];

            if (string.IsNullOrEmpty(token))
            {
                throw new Exception("Token is empty");
            }

            var user = _getUserByRefreshToken(token);
            var refreshToken = user.RefreshTokens.Single(x => x.Token == token);

            if (!refreshToken.IsActive)
            {
                throw new Exception("Invalid token");
            }

            _revokeRefreshToken(refreshToken, null, "Revoked without replacement");
            _db.Update(user);
            await _db.SaveChangesAsync();

            return Ok(); // new { message = "Token revoked" }
        }

        /// <summary>
        /// Получение данных о текущем пользователе
        /// </summary>
        /// <returns></returns>
        //[Authorize]
        [HttpPost("[area]/[controller]/[action]")]
        public async Task<ActionResult<UserDTO>> GetCurrentUser()
        {
            ApplicationUser user = _db.Users.Find(User.GetUserId());

            if (user == null)
            {
                throw new Exception($"Пользователь с указаным id не найден: {User.GetUserId()}");
            }

            return _mapper.Map<UserDTO>(user);
        }

        [AllowAnonymous]
        [HttpPost("[area]/[controller]/[action]")]
        public async Task<ActionResult<RegisterResponse>> Register(RegisterRequest request)
        {
            var newUser = new ApplicationUser
            {
                Email = request.Email,
                UserName = request.Email,
                FullName = request.FullName,
                Gender = request.Gender,
                City = request.City,
                BirthDate = request.BirthDate,
                Avatar = request.Avatar
            };

            var result = await _userManager.CreateAsync(newUser, request.Password);

            if (result.Succeeded)
            {                   
                var code = await _userManager.GenerateEmailConfirmationTokenAsync(newUser);
                code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));

                var callbackUrl = $"{Request.Scheme}://{Request.Host}/account/confirmEmail?userId={newUser.Id}&code={code}";                    

                await _signInManager.SignInAsync(newUser, isPersistent: false);

                EmailService emailService = new EmailService();
                await emailService.SendEmailAsync(request.Email, 
                                                    "Подтверждение EMail",
                                                    $"Подтвердите ваш email по ссылке <a href='{HtmlEncoder.Default.Encode(callbackUrl)}'>кликнув здесь</a>.");

                var jwt = await _tokenManager.GenerateAccessToken(newUser);
                var refreshToken = _tokenManager.GenerateRefreshToken();
                newUser.RefreshTokens = new List<RefreshToken>();
                newUser.RefreshTokens.Add(refreshToken);

                //_removeOldRefreshTokens(user);

                _db.Update(newUser);
                await _db.SaveChangesAsync();

                _setTokenCookie(refreshToken.Token);

                return new RegisterResponse() { AccessToken = jwt };
            }
            else
            {
                throw new RegistrationException(result.Errors.Select(e => e.Description));
            }
        }

        [HttpPost("[area]/[controller]/[action]")]
        public async Task<ActionResult> RemoveAccount()
        {
            var user = await _db.Users.FindAsync(User.GetUserId());
            
            _db.Users.Remove(user);
            await _db.SaveChangesAsync();

            return Ok();
        }

        /**
         ConfirmEmail метод: логика OnGetAsync ConfirmEmail.cshtml.cs 
         */
        [HttpPost("[area]/[controller]/[action]")]
        public async Task<ActionResult<LoginResponse>> ConfirmEmail(ConfirmEmailRequest request)
        {
            if (request.UserId == null || request.Code == null)
            {
                throw new Exception("Передано пустое/неверное значение");
                //return RedirectToPage("/Index");
            }

            var user = await _userManager.FindByIdAsync(request.UserId);
            if (user == null)
            {
                return NotFound($"Не возможно найти пользователя с Id '{request.UserId}'.");
            }

            request.Code = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(request.Code));
            var result = await _userManager.ConfirmEmailAsync(user, request.Code);

            if (!result.Succeeded)
            {
                throw new RegistrationException(result.Errors.Select(e => e.Description));
            }

            var response = await _tokenManager.GenerateAccessToken(user);
            return new LoginResponse() { AccessToken = response };
        }

        [HttpPost("[area]/[controller]/[action]")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null || !(await _userManager.IsEmailConfirmedAsync(user)))
            {
                // Don't reveal that the user does not exist or is not confirmed
                //return RedirectToPage("./ForgotPasswordConfirmation");
                throw new Exception("Передано пустое/неверное значение");
            }

            // For more information on how to enable account confirmation and password reset please 
            // visit https://go.microsoft.com/fwlink/?LinkID=532713
            var code = await _userManager.GeneratePasswordResetTokenAsync(user);
            code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));

            var callbackUrl = $"{Request.Scheme}://{Request.Host}/account/forgotPasswordStep3?code={code}&email={request.Email}";

            //var callbackUrl = Url.Page(
            //    "/Account/ResetPassword",
            //    pageHandler: null,
            //    values: new { area = "Identity", code },
            //    protocol: Request.Scheme);

            //await _emailSender.SendEmailAsync(
            //    Input.Email,
            //    "Reset Password",
            //    $"Please reset your password by <a href='{HtmlEncoder.Default.Encode(callbackUrl)}'>clicking here</a>.");

                
            EmailService emailService = new EmailService();
            await emailService.SendEmailAsync(request.Email, "Восстановление пароля",
                $"Пожалуйста, измените свой пароль по ссылке <a href='{HtmlEncoder.Default.Encode(callbackUrl)}'>кликнув здесь</a>.");

            return Ok();
            
        }

        [HttpPost("[area]/[controller]/[action]")]
        public async Task<IActionResult> ResetPassword(ResetPasswordRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                // Don't reveal that the user does not exist
                //return RedirectToPage("./ResetPasswordConfirmation");
                throw new Exception("Передано пустое/неверное значение");
            }

                
            string code = Base64UrlEncoder.Decode(request.Code);

            var result = await _userManager.ResetPasswordAsync(user, code, request.Password);
            if (result.Succeeded)
            {
                return Ok();
            }
            else
            {
                throw new RegistrationException(result.Errors.Select(e => e.Description));
            }

            
        }

        [HttpPost("[area]/[controller]/[action]")]
        public async Task<IActionResult> ConfirmEmailChange(ConfirmEmailChangeRequest request)
        {
            if (request.UserId == null || request.Email == null || request.Code == null)
            {
                throw new Exception("Передано пустое/неверное значение");
                //return RedirectToPage("/Index");
            }

            var user = await _userManager.FindByIdAsync(request.UserId);
            if (user == null)
            {
                return NotFound($"Не возможно найти пользователя с Id '{request.UserId}'.");
            }

            var code = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(request.Code));
            var result = await _userManager.ChangeEmailAsync(user, request.Email, code);
            if (!result.Succeeded)
            {
                throw new Exception("Ошибка изменения email.");
            }

            // In our UI email and user name are one and the same, so when we update the email
            // we need to update the user name.
            var setUserNameResult = await _userManager.SetUserNameAsync(user, request.Email);
            if (!setUserNameResult.Succeeded)
            {
                throw new Exception("Ошибка изменения имени пользователя.");
            }

            await _signInManager.RefreshSignInAsync(user);
            //StatusMessage = "Спасибо за подтверждение изменения email.";
            return Ok();
            
        }

        // controller helper methods

        private void _setTokenCookie(string token)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.Now.AddDays(_jwtConfiguration.RefreshTokenExpirationDays)
            };

            Response.Cookies.Append("refreshToken", token, cookieOptions);
        }

        // jwt utils helper methods

        private ApplicationUser _getUserByRefreshToken(string token)
        {
            var user = _db.Users.SingleOrDefault(u => u.RefreshTokens.Any(t => t.Token == token));

            if (user is null)
            {
                throw new Exception("Invalid token");
            }

            return user;
        }

        private RefreshToken _rotateRefreshToken(RefreshToken refreshToken)
        {
            var newRefreshToken = _tokenManager.GenerateRefreshToken();
            _revokeRefreshToken(refreshToken, "Replaced by new token", newRefreshToken.Token);
            return newRefreshToken;
        }

        private void _removeOldRefreshTokens(ApplicationUser user)
        {
            user.RefreshTokens.RemoveAll(x =>
                !x.IsActive &&
                x.Created.AddDays(_jwtConfiguration.RefreshTokenTTL) <= DateTime.Now);
        }

        private void _revokeDescendantRefreshTokens(RefreshToken refreshToken, ApplicationUser user, string reason)
        {
            if (!string.IsNullOrEmpty(refreshToken.ReplacedByToken))
            {
                var childToken = user.RefreshTokens.SingleOrDefault(x => x.Token == refreshToken.ReplacedByToken);
                if (childToken.IsActive)
                {
                    _revokeRefreshToken(childToken, reason);
                }
                else
                {
                    _revokeDescendantRefreshTokens(childToken, user, reason);
                }
            }
        }

        private void _revokeRefreshToken(RefreshToken token, /*string ipAddress*/string reason = null, string replacedByToken = null)
        {
            token.Revoked = DateTime.Now;
            token.ReasonRevoked = reason;
            token.ReplacedByToken = replacedByToken;
        }
    }
}


