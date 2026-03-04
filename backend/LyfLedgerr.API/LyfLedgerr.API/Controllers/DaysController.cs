using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using LyfLedgerr.API.Data;
using LyfLedgerr.API.Models;

namespace LyfLedgerr.API.Controllers;

[ApiController]
[Route("api/[controller]")]
//[Authorize]
public class DaysController : ControllerBase
{
    private readonly AppDbContext _context;

    public DaysController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetUserDays()
    {
        var userId = 1;

        var days = await _context.DayLogs
            .Where(d => d.UserId == userId)
            .Include(d => d.Hours)
            .ThenInclude(h => h.Category)
            .ToListAsync();

        return Ok(days);
    }

    [HttpPost]
    public async Task<IActionResult> CreateDay()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
            return Unauthorized("Invalid token");

        var userId = int.Parse(userIdClaim);

        var today = DateTime.UtcNow.Date;

        var existingDay = await _context.DayLogs
            .FirstOrDefaultAsync(d => d.Date == today && d.UserId == userId);

        if (existingDay != null)
            return BadRequest("Day already exists");

        var day = new DayLog
        {
            Date = today,
            UserId = userId
        };

        _context.DayLogs.Add(day);
        await _context.SaveChangesAsync();

        return Ok(day);
    }
}