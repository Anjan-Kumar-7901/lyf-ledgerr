namespace LyfLedgerr.API.Models;

public class DayLog
{
    public int Id { get; set; }

    public DateTime Date { get; set; }

    public int UserId { get; set; }

    public User? User { get; set; }

    public List<HourLog> Hours { get; set; } = new();
}