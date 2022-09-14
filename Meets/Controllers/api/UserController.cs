using System;
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
using Microsoft.AspNetCore.Authorization;
using AutoMapper;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using System.Dynamic;
using Meets.Controllers.api.dto.User;
using System.Security.Claims;
using Meets.Exceptions;

namespace Meets.Controllers.api
{
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

        /// <summary>
        /// Метод для получения информации о пользователе и признака аутентификации. Должен быть открыт для неавторизованных пользователей
        /// </summary>
        /// <returns></returns>
        //[DisableCors]
        [HttpPost("[area]/[controller]/[action]")]
        public async Task<ActionResult<UserAuthInfo>> GetAuthInfo()
        {
            UserAuthInfo res = new UserAuthInfo()
            {
                IsAuthenticated = false
            };

            if (User.Identity.IsAuthenticated)
            {
                res.IsAuthenticated = true;

                ApplicationUser user = _db.Users.Find(User.GetUserId());
                res.UserName = user.UserName;
                res.User = user;
                res.City = user.City;
                res.IsAdmin = await _userManager.IsInRoleAsync(user, "Administrator");

                if (user.Latitude != 0 && user.Longitude != 0)
                {
                    res.HasGeolocation = true;
                }
            }

            return res;
            
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
        public ActionResult<List<UserIndexDTO>> GetList([FromForm]string name, 
                                    [FromForm]List<string> tag, 
                                    [FromForm]string city, 
                                    [FromForm]int? ageTo, 
                                    [FromForm]int? ageFrom, 
                                    [FromForm]Gender gender, 
                                    [FromForm]double radius = 0)
        {
            IQueryable<ApplicationUser> res = _db.Users;//.Where(x => x.Id != User.GetUserId());

            //ViewBag.tag = tag;

            if (gender == Gender.Undefined)
            {
                //ViewBag.gender = Gender.Undefined;
                res = _db.Users;
            }

            if (gender == Gender.Male)
            {
                res = res.Where(x => x.Gender == Gender.Male);
            }

            if (gender == Gender.Female)
            {
                res = res.Where(x => x.Gender == Gender.Female);
            }

            if (!string.IsNullOrEmpty(name))
            {
                string nameTrimed = name.Trim();
                res = res.Where(x => x.FullName.Contains(nameTrimed));
            }

            if (!string.IsNullOrEmpty(city))
            {
                string cityTrimed = city.Trim();
                res = res.Where(x => x.City.Contains(cityTrimed));
            }

            // TODO переделать как появится react-select
            if (tag.Count != 0)
            {
                List<ApplicationUser> users = new List<ApplicationUser>();

                foreach (var i in tag)
                {
                    foreach (var r in res.Where(t => t.Tags.Contains(i)))
                    {
                        users.Add(r);
                    }
                }

                res = users.AsQueryable();
            }

            if (ageTo > 0)
            {
                res = res.Where(x => DateTime.Now.Year - x.BirthDate.Value.Year > ageTo);
            }

            if (ageFrom > 0)
            {
                res = res.Where(x => DateTime.Now.Year - x.BirthDate.Value.Year < ageFrom);
            }

            if (radius > 0)
            {
                ApplicationUser user = _db.Users.Find(User.GetUserId());
                double latitude = user.Latitude;
                double longtitude = user.Longitude;
                double longGr1km = 1 / Math.Cos(Math.PI * latitude / 180);
                double latGr1km = 1 / 111.13;
                double longRadiusGr = radius * longGr1km;
                double latRadiusGr = radius * latGr1km;

                double minLat = latitude - latRadiusGr;
                double minLong = longtitude - longRadiusGr;
                double maxLat = latitude + latRadiusGr;
                double maxLong = longtitude + longRadiusGr;

                res = res.Where(x => x.Latitude > minLat && x.Latitude < maxLat);
                res = res.Where(x => x.Longitude > minLong && x.Longitude < maxLong);
            }

            List<UserIndexDTO> userIndexList = new List<UserIndexDTO>();
            foreach (var userRes in res)
            {
                UserIndexDTO userIndexDto = new UserIndexDTO();

                userIndexDto.Id = userRes.Id;
                userIndexDto.FullName = userRes.FullName;
                userIndexDto.City = userRes.City;
                userIndexDto.Avatar = userRes.Avatar;
                userIndexDto.Gender = userRes.Gender;
                userIndexDto.BirthDate = userRes.BirthDate;
                userIndexDto.Email = userRes.Email;
                userIndexDto.Tags = string.IsNullOrEmpty( userRes.Tags )? null: userRes.Tags.Split(';').ToList();

                if ( _db.Subscribtions.Find(User.GetUserId(), userRes.Id) != null )
                {
                    userIndexDto.IsSubscribed = true;
                }                

                userIndexList.Add(userIndexDto);
            }

            return userIndexList;
            
        }

        [Authorize]
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

        [Authorize]
        [HttpPost("[area]/[controller]/[action]")]
        public IActionResult SaveUserCity(CityDTO request)
        {
            var user = _db.Users.Find(User.GetUserId());
            user.City = request.Name;
                
            _db.Entry(user).State = EntityState.Modified;
            _db.SaveChanges();

            return Ok(); 
            
        }

        [Authorize]
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

        [Authorize]
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

        [Authorize]
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

        [Authorize]
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

        [Authorize]
        [HttpPost("[area]/[controller]/[action]")]
        public async Task<ActionResult> ChangePassword([FromForm]ChangePasswordDTO model)
        {
            ApplicationUser user = _db.Users.Find(User.GetUserId());

            var result = await _userManager.ChangePasswordAsync(user, model.OldPassword, model.NewPassword);

            // SUCCESS
            if (!result.Succeeded)
            {
                throw new ChangePasswordException(result);
            }

            await _signInManager.SignInAsync(user, isPersistent: false);
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