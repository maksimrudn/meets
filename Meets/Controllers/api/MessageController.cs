using AutoMapper;
using Meets.Data;
using Meets.Extensions;
using Meets.Models;
using Meets.Controllers.api.dto.Message;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;

namespace Meets.Controllers.api
{
    [Authorize]
    [Area("api")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private ApplicationDbContext _db;
        private IWebHostEnvironment _hostEnv;
        private IMapper _mapper;
        private SignInManager<ApplicationUser> _signInManager;

        public MessageController(ApplicationDbContext db,
                            IWebHostEnvironment hostEnv,
                            IMapper mapper,
                                SignInManager<ApplicationUser> signInManager)
        {
            _db = db;
            _hostEnv = hostEnv;
            _mapper = mapper;
            _signInManager = signInManager;
        }

        [HttpPost("[area]/[controller]/[action]")]
        public IActionResult GetMessages(GetMessagesParamsDTO paramsDTO)
        {
            try
            {
                ApplicationUser targetUser = _db.Users.Find(paramsDTO.TargetUserId);

                if (targetUser == null) throw new Exception($"Пользователь с идентификатором {paramsDTO.TargetUserId} - не найден");

                ulong currentUserId = User.GetUserId();

                var res = _db.Messages.Where(x => (x.ReceiverId == paramsDTO.TargetUserId && 
                                                        x.SenderId == currentUserId) ||
                                                   (x.ReceiverId == currentUserId && 
                                                        x.SenderId == paramsDTO.TargetUserId))
                                        .ToList();
                               
                return Ok(res);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                                        new
                                        {
                                            errors = new[] {
                                                new
                                                {
                                                    code = "",
                                                    description = ex.Message
                                                }}
                                        });
            }
        }


        [HttpPost("[area]/[controller]/[action]")]
        public IActionResult GetReceiverInfo(GetReceiverInfoParamsDTO paramsDTO)
        {
            try
            {
                ApplicationUser user = _db.Users.Find(paramsDTO.TargetUserId);

                if (user == null) throw new Exception($"Пользователь с идентификатором {paramsDTO.TargetUserId} - не найден");

                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                                        new
                                        {
                                            errors = new[] {
                                                new
                                                {
                                                    code = "",
                                                    description = ex.Message
                                                }}
                                        });
            }
        }


        /// <summary>
        /// Получает список диалогов для текущего пользователя
        /// </summary>
        /// <returns></returns>
        [HttpPost("[area]/[controller]/[action]")]
        public IActionResult GetDialogs()
        {
            try
            {
                ulong currentUserId = User.GetUserId();

                List<Message> lastMessages = new List<Message>();
                var receivers = _db.Messages
                                        .Where(x => x.SenderId == currentUserId && 
                                                    x.ReceiverId != currentUserId) // исключаем ситуации когда сообщение отправлено самому себе
                                        .Select(x => x.ReceiverId)
                                        .Distinct()
                                        .ToList();

                foreach (var rsv in receivers)
                {
                    var msg = _db.Messages
                                    .Where(x => x.SenderId == currentUserId && 
                                                 x.ReceiverId == rsv)
                                    .OrderBy(x => x.Createdate)
                                    .Last();
                    lastMessages.Add(msg);
                }

                lastMessages = lastMessages.OrderByDescending(x => x.Createdate).ToList();

                return Ok(lastMessages);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                                        new
                                        {
                                            errors = new[] {
                                                new
                                                {
                                                    code = "",
                                                    description = ex.Message
                                                }}
                                        });
            }
        }

        [HttpPost("[area]/[controller]/[action]")]
        public IActionResult SendMessage([FromForm]MessageDTO message)
        {
            try
            {
                if (message.ReceiverId == User.GetUserId()) throw new Exception("Сообщение не может быть отправлено самому себе");

                Message msg = new Message();
                msg.SenderId = User.GetUserId();
                msg.ReceiverId = message.ReceiverId;
                msg.Createdate = DateTime.Now;
                msg.Text = message.Text;

                _db.Messages.Add(msg);
                _db.SaveChanges();

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                                        new
                                        {
                                            errors = new[] {
                                                new
                                                {
                                                    code = "",
                                                    description = ex.Message 
                                                }}
                                        });
            }
        }

    }
}
