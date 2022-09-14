namespace Meets.Controllers.api.dto.Error
{
    public class Error
    {
        public string code { get; private set; }

        public string description { get; private set; }

        public Error(string code, string description)
        {
            this.code = code;
            this.description = description;
        }
    }
}
