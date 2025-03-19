using Microsoft.EntityFrameworkCore;
using ExpenseSplitterAppBackend.Models;

namespace ExpenseSplitterAppBackend.Data
{
    public class ExpenseSplitterDbContext : DbContext
    {
        public ExpenseSplitterDbContext(DbContextOptions<ExpenseSplitterDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<GroupMember> GroupMembers { get; set; }
        public DbSet<Expense> Expenses { get; set; }
        public DbSet<Payment> Payments { get; set; }
    }
}
