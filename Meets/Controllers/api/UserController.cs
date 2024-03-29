﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Meets.Models;
using Meets.Data;
using Microsoft.AspNetCore.Identity;
using Meets.Extensions;
using Meets.Models.User;
using Microsoft.EntityFrameworkCore;
using Meets.Domain;
using AutoMapper;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using System.Dynamic;
using Meets.Controllers.api.dto.User;
using System.Security.Claims;
using Meets.Exceptions;
using Meets.Controllers.api.dto;
using Meets.Services;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;
using System.Text.Encodings.Web;
using Meets.Infrastructure;

namespace Meets.Controllers.api
{
    [Authorize]
    [DisableCors]
    [Area("api")]
    [ApiController]
    public class UserController : ControllerBase
    {
        ApplicationDbContext _db;

        private UserManager<ApplicationUser> _userManager;
        private SignInManager<ApplicationUser> _signInManager;
        private IMapper _mapper;
        private IWebHostEnvironment _hostEnv;

        public UserController(ApplicationDbContext context,
                            SignInManager<ApplicationUser> signInManager,
                            UserManager<ApplicationUser> userManager,
                            IMapper mapper,
                            IWebHostEnvironment webHost)
        {
            _db = context;
            _signInManager = signInManager;
            _userManager = userManager;
            _mapper = mapper;
            _hostEnv = webHost;
        }

        

        // todo: Необходимо выделить специальный метод, который будет возвращать события пользователя для фронта (например getEvents(..)), либо использовать event api
        // todo: параметры должны быть не в int а в bool и все они должны передаваться одной dto
        [Obsolete]
        [HttpPost("[area]/[controller]/[action]")]
        public async Task<ActionResult<UserCardResponse>> GetCard(GetCardRequest request)
        {
            var response = await Task<UserCardResponse>.Run(async () =>
            {
                if (!ModelState.IsValid)
                {
                    throw new ModelValidationException(ModelState);
                }

                ApplicationUser user = _db.Users.Find(request.UserId);

                UserCardResponse userCard = new UserCardResponse();

                userCard.Id = user.Id;
                userCard.Gender = user.Gender;
                userCard.BirthDate = user.BirthDate;
                userCard.FullName = user.FullName;
                userCard.Avatar = user.Avatar;
                userCard.City = user.City;
                userCard.Company = user.Company;
                userCard.Job = user.Job;
                userCard.Specialization = user.Specialization;
                userCard.LockoutEnabled = user.LockoutEnabled;
                userCard.Tags = !string.IsNullOrEmpty(user.Tags) ? user.Tags.Split(";").ToList() : new List<string>();
                userCard.Latitude = user.Latitude;
                userCard.Longitude = user.Longitude;
                userCard.Description = user.Description;
                userCard.Growth = user.Growth;
                userCard.Weight = user.Weight;
                userCard.Subscribers = user.Subscribers.Count;
                userCard.Subscriptions = user.Subscribtions.Count;

                if(_db.Meetings.Where(x => x.OwnerId == User.GetUserId() && 
                    x.TargetId == request.UserId &&
                    x.Status != MeetingStatus.Canceled
                    ).Count() != 0)
                {
                    userCard.IsInvited = true;
                }
                else
                {
                    userCard.IsInvited = false;
                }

                userCard.Meetings = await _db.Meetings.Where(x => (x.OwnerId == user.Id && x.Status == MeetingStatus.Canceled) ||
                                                             (x.TargetId == user.Id && x.Status == MeetingStatus.Canceled)).CountAsync();

                userCard.Learnings = _db.Learnings.Where(x => x.UserId == user.Id && !x.IsDeleted).ToList();
                userCard.Works = _db.Works.Where(x => x.UserId == user.Id && !x.IsDeleted).ToList();
                userCard.Activities = _db.Activities.Where(x => x.UserId == user.Id && !x.IsDeleted).ToList();
                userCard.Facts = _db.Facts.Where(x => x.UserId == user.Id && !x.IsDeleted).ToList();


                // вычисление расстояния допользователя
                if(_isSignedIn(User))
                {
                    ApplicationUser currentUser = _db.Users.Find(User.GetUserId());
                    if (currentUser.Id != user.Id &&
                        currentUser.Latitude != 0 && currentUser.Longitude != 0 &&
                        user.Latitude != 0 && user.Longitude != 0)
                    {
                        /*double rLatitude1 = Math.PI * currentUser.Latitude / 180;
                        double rLatitude2 = Math.PI * user.Latitude / 180;
                        double theta = currentUser.Longitude - user.Longitude;
                        double rTheta = Math.PI * theta / 180;
                        double dist = Math.Sin(rLatitude1) * Math.Sin(rLatitude2) 
                                        * Math.Cos(rLatitude1) * Math.Cos(rLatitude2) 
                                        * Math.Cos(rTheta);
                        dist = Math.Acos(dist);
                        dist = dist / 180 * Math.PI;
                        dist = dist * 60 * 1.1515 * 1.609344;*/

                        var d1 = currentUser.Latitude * (Math.PI / 180.0);
                        var num1 = currentUser.Longitude * (Math.PI / 180.0);
                        var d2 = user.Latitude * (Math.PI / 180.0);
                        var num2 = user.Longitude * (Math.PI / 180.0) - num1;
                        var d3 = Math.Pow(Math.Sin((d2 - d1) / 2.0), 2.0) + Math.Cos(d1) * Math.Cos(d2) * Math.Pow(Math.Sin(num2 / 2.0), 2.0);

                        var dist = Math.Round(((6376500.0 * (2.0 * Math.Atan2(Math.Sqrt(d3), Math.Sqrt(1.0 - d3)))) / 1000), 0);

                        userCard.Distance = dist;
                    }
                }


                if (_isSignedIn(User))
                {
                    if (_db.Subscribtions.Find(User.GetUserId(), request.UserId) != null)
                    {
                        userCard.IsSubscribed = true;
                    }
                    else
                    {
                        userCard.IsSubscribed = false;
                    }
                }

                return userCard;
            });
            return response;
            
        }

        
        [HttpPost("[area]/[controller]/[action]")]
        public async Task<ActionResult<ProfileSettingsDTO>> GetProfileSettings(ByUserIdRequest request)
        {
            ApplicationUser user = await _db.Users.FindAsync(request.UserId);

            ProfileSettingsDTO settingsDTO = new ProfileSettingsDTO();
            settingsDTO.Email = user.Email;
            settingsDTO.EmailConfirmed = user.EmailConfirmed;
            settingsDTO.IsInvitable = user.IsInvitable;
            settingsDTO.IsSearchable = user.IsSearchable;
            settingsDTO.IsGeoTracking = user.IsGeoTracking;
            settingsDTO.Company = user.Company;
            settingsDTO.Specialization = user.Specialization;
            settingsDTO.Job = user.Job;
            settingsDTO.Telegram = user.Telegram;

            return settingsDTO;
        }

        
        [HttpPost("[area]/[controller]/[action]")]
        public async Task<IActionResult> EditProfileSettings(EditProfileSettingsDTO request)
        {
            ApplicationUser user = await _db.Users.FindAsync(request.UserId);

            if (user is not null)
            {
                user.EmailConfirmed = request.EmailConfirmed;
                user.IsInvitable = request.IsInvitable;
                user.IsSearchable = request.IsSearchable;
                user.IsGeoTracking = request.IsGeoTracking;
                user.Company = request.Company;
                user.Specialization = request.Specialization;
                user.Job = request.Job;

                if (!string.IsNullOrEmpty(request.Telegram))
                    user.Telegram = request.Telegram.StartsWith('@') ? request.Telegram : "@" + request.Telegram;
                else
                    user.Telegram = "";

                _db.Entry(user).State = EntityState.Modified;
                await _db.SaveChangesAsync();
            }

            return Ok();
        }

        [HttpPost("[area]/[controller]/[action]")]
        public ActionResult<List<UserListItemDTO>> GetList(GetListRequest request)
        {
            IQueryable<ApplicationUser> res = _db.Users;//.Where(x => x.Id != User.GetUserId());

            if (!string.IsNullOrEmpty(request.City))
            {
                string cityTrimed = request.City.Trim();
                res = res.Where(x => x.City.Contains(cityTrimed));
            }

            // TODO переделать как появится react-select
            if (request.Tags.Count != 0)
            {
                List<ApplicationUser> users = new List<ApplicationUser>();

                foreach (var i in request.Tags)
                {
                    foreach (var r in res.Where(t => t.Tags.Contains(i)))
                    {
                        users.Add(r);
                    }
                }

                res = users.Distinct().AsQueryable();
            }

            if (request.GrowthFrom > 0)
            {
                res = res.Where(x => x.Growth >= request.GrowthFrom);
            }

            if (request.GrowthTo > 0)
            {
                res = res.Where(x => x.Growth <= request.GrowthTo);
            }

            if (request.WeightFrom > 0)
            {
                res = res.Where(x => x.Weight >= request.WeightFrom);
            }

            if (request.WeightTo > 0)
            {
                res = res.Where(x => x.Weight <= request.WeightTo);
            }

            if (request.AgeFrom > 0)
            {
                res = res.Where(x => DateTime.Now.Year - x.BirthDate.Value.Year >= request.AgeFrom);
            }

            if (request.AgeTo > 0)
            {
                res = res.Where(x => DateTime.Now.Year - x.BirthDate.Value.Year <= request.AgeTo);
            }

            if (!string.IsNullOrEmpty(request.Company))
            {
                string companyTrimed = request.Company.Trim().ToLower();
                res = res.Where(x => x.Company.ToLower().Contains(companyTrimed));
                //res = res.Where(x => x.Works.Any(w => w.Title.ToLower().Contains(workTrimed)));
            }

            if (!string.IsNullOrEmpty(request.Learning))
            {
                string leaningTrimed = request.Learning.Trim().ToLower();
                res = res.Where(x => x.Learnings.Any(w => w.Title.ToLower().Contains(leaningTrimed)));
            }

            if (!string.IsNullOrEmpty(request.Activity))
            {
                string activityTrimed = request.Activity.Trim().ToLower();
                res = res.Where(x => x.Activities.Any(w => w.Title.ToLower().Contains(activityTrimed)));
            }

            List<UserListItemDTO> userIndexList = new List<UserListItemDTO>();
            foreach (var userRes in res)
            {
                UserListItemDTO userIndexDto = new UserListItemDTO();

                userIndexDto.Id = userRes.Id;
                userIndexDto.FullName = userRes.FullName;
                userIndexDto.City = userRes.City;
                userIndexDto.Avatar = userRes.Avatar;
                userIndexDto.Gender = userRes.Gender;
                userIndexDto.BirthDate = userRes.BirthDate;
                userIndexDto.Email = userRes.Email;
                userIndexDto.Company = userRes.Company;
                userIndexDto.Job = userRes.Job;
                userIndexDto.Tags = string.IsNullOrEmpty( userRes.Tags )? null: userRes.Tags.Split(';').ToList();

                if ( _db.Subscribtions.Find(User.GetUserId(), userRes.Id) != null )
                {
                    userIndexDto.IsSubscribed = true;
                }                

                userIndexList.Add(userIndexDto);
            }

            return userIndexList;
            
        }

        
        [HttpPost("[area]/[controller]/[action]")]
        public IActionResult SaveUserGeo([FromForm]UserGeodataDTO userGeodata)
        {   
            var user = _db.Users.Find(userGeodata.Id);
            user.Latitude = userGeodata.Latitude;
            user.Longitude = userGeodata.Longitude;

            _db.Entry(user).State = EntityState.Modified;
            _db.SaveChanges();

            return Ok();
        }

        
        [HttpPost("[area]/[controller]/[action]")]
        public IActionResult SaveUserCity(CityDTO request)
        {
            var user = _db.Users.Find(User.GetUserId());
            user.City = request.Name;
                
            _db.Entry(user).State = EntityState.Modified;
            _db.SaveChanges();

            return Ok(); 
            
        }

        
        [HttpPost("[area]/[controller]/[action]")]
        public ActionResult<Coordinates> GetCoordinatesForCurrentUser()
        {
            ApplicationUser user = _db.Users.Find(User.GetUserId());

            if (user.Latitude == 0 && user.Longitude == 0)
            {
                return Ok(null);
            }
            else
            {
                Coordinates coordinates = new Coordinates();
                coordinates.Latitude = user.Latitude;
                coordinates.Longitude = user.Longitude;
                return coordinates;
            }
        }

        
        [HttpPost("[area]/[controller]/[action]")]
        public ActionResult<UserDTO> Get(GetParamsDTO getParamsDTO)
        {
            ApplicationUser user = _db.Users.Find(getParamsDTO.UserId);

            if (user == null)
            {
                throw new Exception($"Пользователь с указаным id не найден: {getParamsDTO.UserId}");
            }

            return _mapper.Map<UserDTO>(user);
        }

        
        [HttpPost("[area]/[controller]/[action]")]
        public async Task<ActionResult> Edit([FromForm]UserDTO userDto, [FromForm]IFormFile photo)
        {
            if (!ModelState.IsValid)
            {
                throw new ModelValidationException(ModelState);
            }

            ApplicationUser user = _db.Users.Find(userDto.Id);

            if (user != null)
            {
                // широта и долгота не сохраняются (игнорируются), так как их сохранение выполняется отдельными действиями
                _mapper.Map<UserDTO, ApplicationUser>(userDto, user);

                _db.Entry(user).State = EntityState.Modified;
                _db.SaveChanges();
            }

            if (photo is not null)
            {
                user.Avatar = await _savePhotoToUsersFolder(userDto, photo);

                _db.Entry(user).State = EntityState.Modified;
                _db.SaveChanges();
            }

            return Ok();

        }

        private async Task<string> _savePhotoToUsersFolder(UserDTO user, IFormFile photo)
        {
            string resultImageSequence = user.Avatar;


            string folderName = user.Id.ToString();
            string folderPath = _hostEnv.WebRootPath + "\\Content\\users";
            string fullFolderPath = Path.Combine(folderPath, folderName);

            if (photo != null)
            {
                if (!string.IsNullOrEmpty(user.Avatar))
                {
                    user.Avatar = null;
                }

                // формирование имени файла [name.ext], где name = номеру фото (ранее вычесленному), ext - расширение, берётся из полученного файла
                string newPhotoName = "avatar." + photo.FileName.Split('.').Last();
                resultImageSequence = newPhotoName;


                if (!Directory.Exists(fullFolderPath))
                    Directory.CreateDirectory(fullFolderPath);

                string filePath = Path.Combine(fullFolderPath, newPhotoName);

                using (Stream fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await photo.CopyToAsync(fileStream);
                }
            }
            else
            {
                if (Directory.Exists(fullFolderPath))
                {
                    System.IO.File.Delete(fullFolderPath);
                }
            }

            return resultImageSequence;
        }

        
        [HttpPost("[area]/[controller]/[action]")]
        public ActionResult RemoveUserAvatar()
        { 
            var user = _db.Users.Find(User.GetUserId());

            if (user != null)
            {
                string folderName = user.Id.ToString();
                string folderPath = _hostEnv.WebRootPath + "\\content\\users";
                string fullFolderPath = Path.Combine(folderPath, folderName);

                if(System.IO.File.Exists(Path.Combine(fullFolderPath, user.Avatar)))
                    System.IO.File.Delete(Path.Combine(fullFolderPath, user.Avatar));

                user.Avatar = null;

                _db.Entry(user).State = EntityState.Modified;
                _db.SaveChanges();
            }

            return Ok();
        }

        
        [HttpPost("[area]/[controller]/[action]")]
        public async Task<ActionResult> ChangePassword(ChangePasswordRequest model)
        {
            ApplicationUser user = await _db.Users.FindAsync(User.GetUserId());

            var result = await _userManager.ChangePasswordAsync(user, model.OldPassword, model.NewPassword);

            // SUCCESS
            if (!result.Succeeded)
            {
                throw new ChangePasswordException(result);
            }

            await _signInManager.SignInAsync(user, isPersistent: false);
            return Ok();
        }

        
        [HttpPost("[area]/[controller]/[action]")]
        public async Task<ActionResult> ConfirmEmail(ConfirmEmailDTO request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);

            if (user is null)
            {
                throw new Exception("Email не подтвержден, не верные данные");
            }

            var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));

            var callbackUrl = $"{Request.Scheme}://{Request.Host}/account/confirmEmail?userId={user.Id}&code={code}";

            //await _userManager.UpdateSecurityStampAsync(user);
            //await _signInManager.SignInAsync(user, isPersistent: false);

            EmailService emailService = new EmailService();
            await emailService.SendEmailAsync(request.Email,
                                                "Подтверждение EMail",
                                                $"Подтвердите ваш email по ссылке <a href='{HtmlEncoder.Default.Encode(callbackUrl)}'>кликнув здесь</a>.");

            return Ok();
        }

        private bool _isSignedIn(ClaimsPrincipal user)
        {
            bool res = false;

            try
            {
                if (User.GetUserId() != 0)
                    res = true;
            }
            catch (Exception)
            {

            }

            return res;
        }
    }
}