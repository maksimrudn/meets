using Meets.Controllers.api.dto;
using Meets.Data;
using Meets.Exceptions;
using Meets.Extensions;
using Meets.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Meets.Controllers.api
{
    [Area("api")]
    [ApiController]
    public class MeetingsController : ControllerBase
    {
        private ApplicationDbContext _db;

        public MeetingsController(ApplicationDbContext db)
        {
            _db = db;
        }


        [Authorize]
        [HttpPost("[area]/[controller]/[action]")]
        public async Task<IActionResult> Invite(ByUserIdRequest request)
        {
            if (!ModelState.IsValid)
            {
                throw new ModelValidationException(ModelState);
            }

            if (User.GetUserId() == request.UserId)
            {
                throw new Exception("Нельзя пригласить самого себя");
            }

            if (await _db.Meetings.FirstOrDefaultAsync(x=>x.OwnerId == User.GetUserId() &&
                                                x.TargetId == request.UserId &&
                                                x.Status != Domain.MeetingStatus.Canceled) != null)
            {
                throw new Exception("Уже приглашён");
            }

            Meeting mt = new Meeting();

            mt.CreateDate = DateTime.Now;
            mt.OwnerId = User.GetUserId();
            mt.TargetId = request.UserId;
            mt.Status = Domain.MeetingStatus.Invite;

            _db.Meetings.Add(mt);
            await _db.SaveChangesAsync();

            return Ok();
        }

        [Authorize]
        [HttpPost("[area]/[controller]/[action]")]
        public async Task<IActionResult> UnSubscribe(ByUserIdRequest request)
        {
            if (!ModelState.IsValid)
            {
                throw new ModelValidationException(ModelState);
            }

            if (User.GetUserId() == request.UserId)
            {
                throw new Exception("Нельзя отписаться от самого себя");
            }

            if (_db.Subscribtions.Find(User.GetUserId(), request.UserId) == null)
            {
                throw new Exception("Подписка отсуствует");
            }

            var fr = await _db.Subscribtions.FindAsync(User.GetUserId(), request.UserId);

            _db.Subscribtions.Remove(fr);
            await _db.SaveChangesAsync();

            return Ok();
        }


    }
}
