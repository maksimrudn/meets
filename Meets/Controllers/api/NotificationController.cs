using Meets.Controllers.api.dto.Notifications;
using Meets.Data;
using Meets.Extensions;
using Meets.Infrastructure;
using Meets.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Meets.Controllers.api
{
    [Authorize]
    [Area("api")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private ApplicationDbContext _db;

        public NotificationController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpPost("[area]/[controller]/[action]")]
        public async Task<List<NotificationDTO>> GetList()
        {
            var notifications = _db.Notifications.Where(x => x.ReceiverId == User.GetUserId());//.OrderBy(o => o.CreatedDate).ToListAsync();

            List<NotificationDTO> list = new List<NotificationDTO>();

            if(notifications is not null)
            {
                foreach(var item in notifications)
                {
                    NotificationDTO dto = new NotificationDTO();
                    dto.Id = item.Id;
                    dto.CreatedDate = item.CreatedDate;
                    dto.Type = item.Type;
                    dto.Message = item.Message;
                    dto.MeetingId = item.MeetingId;
                    dto.Meeting = item.Meeting;
                    dto.SenderId = item.SenderId;
                    dto.Sender = item.Sender;
                    dto.ReceiverId = item.ReceiverId;
                    dto.Receiver=item.Receiver;

                    list.Add(dto);
                }

                list.OrderBy(o => o.CreatedDate);
            }

            return list;
        }
    }
}
