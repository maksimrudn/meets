using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Meets.Migrations
{
    public partial class _1409 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 1m,
                columns: new[] { "Company", "Job" },
                values: new object[] { "VIClouds", "Администратор" });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "Avatar", "BirthDate", "City", "Company", "ConcurrencyStamp", "Description", "Email", "EmailConfirmed", "FullName", "Gender", "Growth", "Job", "Latitude", "LockoutEnabled", "LockoutEnd", "Longitude", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "RoleId", "SecurityStamp", "Specialization", "Tags", "TwoFactorEnabled", "UserName", "Weight" },
                values: new object[] { 2m, 0, null, null, null, "Администратор", "3a770767-445a-4eef-93a3-2389c7949bb5", null, "loader@loader", false, "Загрузчик", null, 0, "VIClouds", 0.0, false, null, 0.0, "loader@loader", "LOADER@LOADER", "AQAAAAEAACcQAAAAEM0ZQUtQTujF33s3DNg2JAmlO/QceeCykr10VbntxSs+mwM8PBbEkqaeObrzCaE4XA==", null, false, null, "b8db65e3-df56-4cc6-ad87-16e1c108db13", null, "", false, "loader@loader", 0 });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 2m);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 1m,
                columns: new[] { "Company", "Job" },
                values: new object[] { null, null });
        }
    }
}
