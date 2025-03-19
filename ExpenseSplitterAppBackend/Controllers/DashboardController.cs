using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ExpenseSplitterAppBackend.Data;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using System.Linq;

[Authorize]
[ApiController]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly ExpenseSplitterDbContext _context;

    public DashboardController(ExpenseSplitterDbContext context)
    {
        _context = context;
    }

    [HttpGet("user-dashboard")]
    public IActionResult GetUserDashboard()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

        // ✅ Get user groups
        var groups = _context.Groups
            .Where(g => _context.GroupMembers.Any(gm => gm.UserId == userId && gm.GroupId == g.Id))
            .Select(g => new
            {
                GroupId = g.Id,
                GroupName = g.GroupName,
                Members = _context.GroupMembers
                    .Where(m => m.GroupId == g.Id)
                    .Join(_context.Users, gm => gm.UserId, u => u.Id, (gm, u) => new
                    {
                        UserId = u.Id,
                        FullName = u.FullName
                    })
                    .ToList()
            })
            .ToList();

        // ✅ Get pending payments (where IsPaid = false)
        var pendingPayments = _context.Payments
            .Where(p => p.UserId == userId && !p.IsPaid)
            .Select(p => new
            {
                ExpenseId = p.ExpenseId,
                Description = p.Expense.Description,
                Amount = p.Amount,
                GroupName = p.Expense.Group.GroupName,
                PaidBy = p.Expense.PaidBy.FullName
            })
            .ToList();

        // ✅ Get completed expenses (where IsSettled = true)
        var completedExpenses = _context.Expenses
            .Where(e => e.IsSettled && _context.Payments.Any(p => p.UserId == userId && p.ExpenseId == e.Id))
            .Select(e => new
            {
                ExpenseId = e.Id,
                Description = e.Description,
                Amount = e.Amount,
                GroupName = e.Group.GroupName,
                PaidBy = e.PaidBy.FullName,
                CreatedAt = e.CreatedAt
            })
            .OrderByDescending(e => e.CreatedAt)
            .ToList();

        return Ok(new
        {
            Groups = groups,
            PendingPayments = pendingPayments,
            CompletedExpenses = completedExpenses
        });
    }
}
