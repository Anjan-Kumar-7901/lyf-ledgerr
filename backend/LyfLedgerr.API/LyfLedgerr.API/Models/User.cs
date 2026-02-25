using System.Globalization;

namespace LyfLedgerr.API.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public List<Category> Categories { get; set; } = new();
        public List<DayLog> Days { get; set; } = new();
    }
}
