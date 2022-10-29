using Meets.Infrastructure;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Meets.Hubs
{
    //[Authorize]
    public class WebRTCHub : Hub
    {
        private static RoomManager _roomManager = new RoomManager();

        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            //_roomManager.DeleteRoom(Context.ConnectionId);
            //_ = NotifyRoomInfoAsync(false);
            return base.OnDisconnectedAsync(exception);
        }

        /// <summary>
        /// создание комнаты
        /// </summary>
        /// <param name="meetingId">ид встречи</param>
        /// <returns></returns>
        public async Task CreateRoom(string meetingId, string companionId) // string name
        {
            // string roomName = name ?? new Guid().ToString();

            await Groups.AddToGroupAsync(Context.ConnectionId, meetingId);
            await Clients.Caller.SendAsync("created", meetingId);

            // уведомение второго пользователя о звонке чтобы он мог подключиться
            await Clients.User(companionId).SendAsync("updateRoom");
            //await NotifyRoomInfoAsync(receiverId, roomInfo);

            //RoomInfo roomInfo = _roomManager.CreateRoom(Context.ConnectionId, new Guid().ToString());
            //if (roomInfo != null)
            //{
            //    await Groups.AddToGroupAsync(Context.ConnectionId, roomInfo.RoomId);
            //    await Clients.Caller.SendAsync("created", roomInfo.RoomId);
            //    await NotifyRoomInfoAsync(receiverId, roomInfo);
            //}
            //else
            //{
            //    await Clients.Caller.SendAsync("error", "error occurred when creating a new room.");
            //}
        }

        /// <summary>
        /// подключение к созданной комнате
        /// </summary>
        /// <param name="meetingId">ид встречи</param>
        /// <returns></returns>
        public async Task Join(string meetingId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, meetingId);
            await Clients.Caller.SendAsync("joined", meetingId);
            await Clients.Group(meetingId).SendAsync("ready");

            //remove the room from room list.
            //if (int.TryParse(roomId, out int id))
            //{
            //    _roomManager.DeleteRoom(id);
            //    //await NotifyRoomInfoAsync(false);
            //}
        }

        /// <summary>
        /// выход из комнаты
        /// </summary>
        /// <param name="meetingId">ид встречи</param>
        /// <returns></returns>
        public async Task LeaveRoom(string meetingId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, meetingId);
            await Clients.Group(meetingId).SendAsync("leave");
        }

        public async Task GetRoomInfo()
        {
            //await NotifyRoomInfoAsync(true);
        }

        public async Task SendMessage(string roomId, object message)
        {
            await Clients.OthersInGroup(roomId).SendAsync("message", message);
        }

        public async Task NotifyRoomInfoAsync(string receiverId, RoomInfo room) // bool notifyOnlyCaller
        {
            //List<RoomInfo> roomInfos = _roomManager.GetAllRoomInfo();
            //var list = from room in roomInfos
            //           select new
            //           {
            //               roomId = room.RoomId,
            //               name = room.Name,
            //               //Button = "<button class=\"joinButton\">Join!</button>"
            //           };
            var data = JsonConvert.SerializeObject(new
            {
                roomId = room.RoomId,
                name = room.Name
            });

            await Clients.User(receiverId).SendAsync("updateRoom", data);

            //if (notifyOnlyCaller)
            //{
            //    await Clients.Caller.SendAsync("updateRoom", data);
            //}
            //else
            //{
                
            //    // отправка сообщения с данными о созанной комнате всем подключенным пользоваетлям
            //    await Clients.All.SendAsync("updateRoom", data);
            //}
        }
    }

    /// <summary>
    /// Room management WebRTCHub
    /// </summary>
    public class RoomManager
    {
        private int _nextRoomId;
        /// <summary>
        /// Room List (key:RoomId)
        /// </summary>
        private ConcurrentDictionary<int, RoomInfo> _rooms;

        public RoomManager()
        {
            _nextRoomId = 1;
            _rooms = new ConcurrentDictionary<int, RoomInfo>();
        }

        public RoomInfo CreateRoom(string connectionId, string name)
        {
            _rooms.TryRemove(_nextRoomId, out _);

            //create new room info
            var roomInfo = new RoomInfo
            {
                RoomId = _nextRoomId.ToString(),
                Name = name,
                HostConnectionId = connectionId
            };
            
            bool result = _rooms.TryAdd(_nextRoomId, roomInfo);

            if (result)
            {
                _nextRoomId++;
                return roomInfo;
            }
            else
            {
                return null;
            }
        }

        public void DeleteRoom(int roomId)
        {
            _rooms.TryRemove(roomId, out _);
        }

        public void DeleteRoom(string connectionId)
        {
            int? correspondingRoomId = null;
            foreach (var pair in _rooms)
            {
                if (pair.Value.HostConnectionId.Equals(connectionId))
                {
                    correspondingRoomId = pair.Key;
                }
            }

            if (correspondingRoomId.HasValue)
            {
                _rooms.TryRemove(correspondingRoomId.Value, out _);
            }
        }

        public List<RoomInfo> GetAllRoomInfo()
        {
            return _rooms.Values.ToList();
        }
    }

    public class RoomInfo
    {
        public string RoomId { get; set; }

        public string Name { get; set; }

        public string HostConnectionId { get; set; }
    }
}
