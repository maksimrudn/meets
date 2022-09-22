using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Meets.Migrations
{
    public partial class settings_data_update : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Searchable",
                table: "AspNetUsers",
                newName: "IsSearchable");

            migrationBuilder.RenameColumn(
                name: "Invitedable",
                table: "AspNetUsers",
                newName: "IsInvitable");

            migrationBuilder.RenameColumn(
                name: "GeoTracking",
                table: "AspNetUsers",
                newName: "IsGeoTracking");

            migrationBuilder.AddColumn<string>(
                name: "Telegram",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Telegram",
                table: "AspNetUsers");

            migrationBuilder.RenameColumn(
                name: "IsSearchable",
                table: "AspNetUsers",
                newName: "Searchable");

            migrationBuilder.RenameColumn(
                name: "IsInvitable",
                table: "AspNetUsers",
                newName: "Invitedable");

            migrationBuilder.RenameColumn(
                name: "IsGeoTracking",
                table: "AspNetUsers",
                newName: "GeoTracking");
        }
    }
}
