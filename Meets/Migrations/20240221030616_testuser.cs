using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Meets.Migrations
{
    public partial class testuser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 1m,
                columns: new[] { "FullName", "Job" },
                values: new object[] { "Administrator", "Administrator" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 2m,
                columns: new[] { "FullName", "Job", "NormalizedUserName", "PasswordHash", "UserName" },
                values: new object[] { "Test User", "Test User", "TEST@TEST", "AQAAAAEAACcQAAAAEJghd3ye4DkVb7Intua5FREfoqVyGBO9Bqgb/QclZj7UB4jWPAjP94qDpHHbaTyi1w==", "test@test" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 1m,
                columns: new[] { "FullName", "Job" },
                values: new object[] { "Администратор", "Администратор" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 2m,
                columns: new[] { "FullName", "Job", "NormalizedUserName", "PasswordHash", "UserName" },
                values: new object[] { "Загрузчик", "Администратор", "LOADER@LOADER", "AQAAAAEAACcQAAAAEM0ZQUtQTujF33s3DNg2JAmlO/QceeCykr10VbntxSs+mwM8PBbEkqaeObrzCaE4XA==", "loader@loader" });
        }
    }
}
