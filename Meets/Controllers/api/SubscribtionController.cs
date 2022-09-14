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
    public class SubscribtionController : ControllerBase
    {
        private ApplicationDbContext _db;

        public SubscribtionController(ApplicationDbContext db)
        {
            _db = db;
        }

        [Authorize]
        [HttpPost("[area]/[controller]/[action]")]
        public async Task<ActionResult<List<Subscribtion>>> GetList(ByUserIdRequest request)
        {
            return await _db.Subscribtions.Where(x=>x.OwnerId == request.UserId).ToListAsync();
        }

        [Authorize]
        [HttpPost("[area]/[controller]/[action]")]
        public async Task<IActionResult> Subscribe(ByUserIdRequest request)
        {
            if (!ModelState.IsValid)
            {
                throw new ModelValidationException(ModelState);
            }

            if (User.GetUserId() == request.UserId)
            {
                throw new Exception("Нельзя подписаться на самого себя");
            }

            if (_db.Subscribtions.Find(User.GetUserId(), request.UserId) != null)
            {
                throw new Exception("Уже подписан");
            }

            Subscribtion sb = new Subscribtion();

            sb.OwnerId = User.GetUserId();
            sb.TargetId = request.UserId;
            sb.CreateDate = DateTime.Now;

            _db.Subscribtions.Add(sb);
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
