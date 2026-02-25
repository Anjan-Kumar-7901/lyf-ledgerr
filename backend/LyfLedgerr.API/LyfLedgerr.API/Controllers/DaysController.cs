using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using LyfLedgerr.API.Data;
using LyfLedgerr.API.Models;

namespace LyfLedgerr.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
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
        var userId = int.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!
        );

        var days = await _context.DayLogs
            .Where(d => d.UserId == userId)
            .Include(d => d.Hours)
            .ThenInclude(h => h.Category)
            .ToListAsync();

        return Ok(days);
    }
}