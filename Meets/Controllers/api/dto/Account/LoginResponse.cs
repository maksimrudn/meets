﻿using System.Text.Json.Serialization;

namespace Meets.Controllers.api.dto.Account
{
    // пример взят отсюда https://www.dnnsoftware.com/docs/developers/jwt/jwt-server-response.html
    public class LoginResponse
    {
        public string AccessToken { get; set; }

        [JsonIgnore]
        public string RefreshToken { get; set; }
    }
}
