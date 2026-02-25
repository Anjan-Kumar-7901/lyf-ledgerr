namespace LyfLedgerr.API.Models;

public class Category
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Color { get; set; } = string.Empty;

    public int UserId { get; set; }

    public User? User { get; set; }
}