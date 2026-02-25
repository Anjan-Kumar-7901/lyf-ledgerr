namespace LyfLedgerr.API.Models;

public class HourLog
{
    public int Id { get; set; }

    public string Time { get; set; } = string.Empty;

    public int? CategoryId { get; set; }

    public Category? Category { get; set; }

    public int DayLogId { get; set; }

    public DayLog? DayLog { get; set; }
}