using Meets.Controllers.api.dto;
using Meets.Controllers.api.dto.Meeting;
using Meets.Data;
using Meets.Exceptions;
using Meets.Extensions;
using Meets.Infrastructure;
using Meets.Models;
using Meets.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Meets.Controllers.api
{
    [Authorize]
    [Area("api")]
    [ApiController]
    public class MeetingsController : ControllerBase
    {
        private ApplicationDbContext _db;
        private NotificationService _notification;

        public MeetingsController(ApplicationDbContext db, NotificationService notification)
        {
            _db = db;
            _notification = notification;
        }


        [HttpPost("[area]/[controller]/[action]")]
        public async Task<IActionResult> Invite(MeetingRequest request)
        {
            if (!ModelState.IsValid)
            {
                throw new ModelValidationException(ModelState);
            }

            if (User.GetUserId() == request.TargetId)
            {
                throw new Exception("Нельзя пригласить самого себя");
            }

            if (await _db.Meetings.FirstOrDefaultAsync(x=>x.OwnerId == User.GetUserId() &&
                                                x.TargetId == request.TargetId &&
                                                x.Status != Domain.MeetingStatus.Canceled) != null)
            {
                throw new Exception("Уже приглашён");
            }

            Meeting mt = new Meeting();

            mt.CreateDate = DateTime.Now;
            mt.OwnerId = User.GetUserId();
            mt.TargetId = request.TargetId;
            mt.MeetingDate = request.MeetingDate;
            mt.Status = Domain.MeetingStatus.Invite;
            mt.Place = request.Place;

            _db.Meetings.Add(mt);
            await _db.SaveChangesAsync();

            var meeting = await _db.Meetings.Where(m => m.TargetId == mt.TargetId && m.OwnerId == mt.OwnerId && m.Status == mt.Status).FirstAsync();

            Message message = new Message();
            message.MeetingId = meeting.Id;
            message.SenderId = meeting.OwnerId;
            message.ReceiverId = meeting.TargetId;
            message.Text = request.Message;
            message.Createdate = DateTime.Now;

            _db.Messages.Add(message);
            await _db.SaveChangesAsync();

            await _notification.Invite(meeting);

            return Ok();
        }

        [HttpPost("[area]/[controller]/[action]")]
        public async Task<ActionResult<List<MeetingDTO>>> GetList()
        {
            var meetings = await _db.Meetings.Where(x=>x.OwnerId == User.GetUserId() || x.TargetId == User.GetUserId()).OrderByDescending(x=>x.MeetingDate).ToListAsync();
            List<MeetingDTO> list = new List<MeetingDTO>();

            foreach(var meet in meetings)
            {
                var dto = new MeetingDTO();

                dto.Id = meet.Id;
                dto.MeetingDate = meet.MeetingDate;
                dto.OwnerId = meet.OwnerId;
                dto.Owner = meet.Owner;
                dto.TargetId = meet.TargetId;
                dto.Target = meet.Target;
                dto.IsOnline = meet.IsOnline;
                dto.Place = meet.Place;
                dto.Status = meet.Status;
                dto.MessageCount = meet.Messages.Count;

                list.Add(dto);
            }

            return list;
        }

        [HttpPost("[area]/[controller]/[action]")]
        public async Task<List<GetTimeTableDTO>> GetTimeTable()
        {
            var meetings = await _db.Meetings
                .Where(x => x.OwnerId == User.GetUserId() ||
                    x.TargetId == User.GetUserId() &&
                    x.Status != Domain.MeetingStatus.Canceled).ToListAsync();
            
            List<GetTimeTableDTO> list = new List<GetTimeTableDTO>();

            foreach (var meet in meetings)
            {
                var dto = new GetTimeTableDTO();

                dto.Id = meet.Id;
                dto.MeetingDate = meet.MeetingDate;
                dto.Place = meet.Place;
                dto.MeetingId = meet.Id;
                dto.CompanionId = meet.TargetId == User.GetUserId() ? meet.OwnerId : meet.TargetId;
                dto.Companion = meet.TargetId == User.GetUserId() ? meet.Owner : meet.Target;

                list.Add(dto);
            }

            return list;
        }

        [HttpPost("[area]/[controller]/[action]")]
        public async Task<ActionResult<GetMeetingDTO>> Get(ByMeetingIdRequest request)
        {
            var meeting = await _db.Meetings.FindAsync(request.MeetingId);

            var dto = new GetMeetingDTO();
            dto.MeetingDate = meeting.MeetingDate;
            dto.Place = meeting.Place;
            dto.CompanionId = meeting.TargetId == User.GetUserId() ? meeting.OwnerId : meeting.TargetId;
            dto.Companion = meeting.TargetId == User.GetUserId() ? meeting.Owner : meeting.Target;
            dto.Status = meeting.Status;
            dto.IsOwner = meeting.OwnerId == User.GetUserId();

            return dto;
        }

        [HttpPost("[area]/[controller]/[action]")]
        public async Task<IActionResult> Edit(EditMeetingRequest request)
        {
            var mt = await _db.Meetings.FindAsync(request.Id);

            mt.MeetingDate = request.MeetingDate;
            mt.Place = request.Place;

            _db.Entry(mt).State = EntityState.Modified;
            await _db.SaveChangesAsync();

            await _notification.Edit(mt);

            return Ok();
        }

        [HttpPost("[area]/[controller]/[action]")]
        public async Task<IActionResult> Discuss(ByMeetingIdRequest request)
        {
            var meeting = await _db.Meetings.FindAsync(request.MeetingId);

            meeting.Status = Domain.MeetingStatus.Discussion;

            _db.Entry(meeting).State = EntityState.Modified;
            await _db.SaveChangesAsync();

            await _notification.Discuss(meeting);

            return Ok();
        }

        [HttpPost("[area]/[controller]/[action]")]
        public async Task<IActionResult> Cancel(ByMeetingIdRequest request)
        {
            var meeting = await _db.Meetings.FindAsync(request.MeetingId);

            meeting.Status = Domain.MeetingStatus.Canceled;

            _db.Entry(meeting).State = EntityState.Modified;
            await _db.SaveChangesAsync();

            await _notification.Cancel(meeting, User.GetUserId());

            return Ok();
        }

        [HttpPost("[area]/[controller]/[action]")]
        public async Task<IActionResult> Confirm(ByMeetingIdRequest request)
        {
            var meeting = await _db.Meetings.FindAsync(request.MeetingId);

            meeting.Status = Domain.MeetingStatus.Confirmed;

            _db.Entry(meeting).State = EntityState.Modified;
            await _db.SaveChangesAsync();

            await _notification.Confirm(meeting);

            return Ok();
        }

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
