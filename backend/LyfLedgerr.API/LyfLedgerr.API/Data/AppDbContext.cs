using Microsoft.EntityFrameworkCore;
using LyfLedgerr.API.Models;

namespace LyfLedgerr.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<DayLog> DayLogs => Set<DayLog>();
    public DbSet<HourLog> HourLogs => Set<HourLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>()
            .HasMany(u => u.Categories)
            .WithOne(c => c.User)
            .HasForeignKey(c => c.UserId);

        modelBuilder.Entity<User>()
            .HasMany(u => u.Days)
            .WithOne(d => d.User)
            .HasForeignKey(d => d.UserId);

        modelBuilder.Entity<DayLog>()
            .HasMany(d => d.Hours)
            .WithOne(h => h.DayLog)
            .HasForeignKey(h => h.DayLogId);
    }
}