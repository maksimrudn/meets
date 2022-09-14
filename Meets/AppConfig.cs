namespace Meets
{
    // класс для хранения различных настроек и значений, чтобы избежать "магических" значений
    public static class AppConfig
    {
        public const string ProductName = "Event Surfing";

        public const string NotificationEmail = "admin@viclouds.ru";

        public const string NotificationEmailPassword = "Qwer1234";

        public const string SMTPServer = "192.168.0.4";

        public const int SMTPPort = 25;
    }
}
