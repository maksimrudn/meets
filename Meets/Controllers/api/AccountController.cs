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

namespace Meets.Controllers.api
{
    [Area("api")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly TokenManager _tokenManager;
        private readonly ApplicationDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private IWebHostEnvironment _env;

        public AccountController(TokenManager tokenManager,
                                ApplicationDbContext db,
                                UserManager<ApplicationUser> userManager,
                                SignInManager<ApplicationUser> signInManager,
                                IWebHostEnvironment env)
        {
            _tokenManager = tokenManager;
            _db = db;
            _userManager = userManager;
            _signInManager = signInManager;
            _env = env;
        }


        [HttpPost("[area]/[controller]/[action]")]
        public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
        {
            
            // todo реализовано не совсем как в изначальных формах identity, необходимо максимально приблизить
            var user = await _userManager.FindByEmailAsync(request.Email);
            var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);

            if (!result.Succeeded)
                throw new Exception("Неправильный логин или пароль");


            var jwt = await _tokenManager.GenerateAccessToken(user);

            return new LoginResponse() { AccessToken = jwt };
            
        }

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
    }
}


