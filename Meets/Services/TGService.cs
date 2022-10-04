using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Meets.Services
{
    public class SendNotificationDTO
    {
        public string UserName { get; set; }

        public string Message { get; set; }
    }

    public class TGService
    {
        private readonly HttpClient _httpClient = new HttpClient();

        private const string _tgSmmToolsAddressTest = "http://localhost:42751";

        public async Task SendNotification(string userName, string message)
        {
            var dto = new SendNotificationDTO();
            dto.UserName = userName;
            dto.Message = message;

            string json = JsonSerializer.Serialize(dto);
            HttpContent content = new StringContent(json, Encoding.UTF8, "application/json");

            string url = _tgSmmToolsAddressTest + "/TGClient/SendMessage";
            HttpResponseMessage response = await _httpClient.PostAsync(url, content);
            response.EnsureSuccessStatusCode();
        } 
    }
}
