using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ExpenseSplitterAppBackend.Data;
using ExpenseSplitterAppBackend.Models;
using System.Security.Claims;

[Authorize]
[ApiController]
[Route("api/expenses")]
public class ExpenseController : ControllerBase
{
    private readonly ExpenseSplitterDbContext _context;

    public ExpenseController(ExpenseSplitterDbContext context)
    {
        _context = context;
    }

    [HttpPost("add")]
    public IActionResult AddExpense([FromBody] ExpenseCreateDto expenseDto)
    {
        // ✅ Get user from JWT Token
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

        // ✅ Find group by its name instead of ID
        var group = _context.Groups
            .Include(g => g.Members)
            .ThenInclude(m => m.User)
            .FirstOrDefault(g => g.GroupName == expenseDto.GroupName);

        if (group == null)
        {
            return BadRequest("Group not found.");
        }

        // ✅ Create the expense
        var expense = new Expense
        {
            Description = expenseDto.Description,
            Amount = expenseDto.Amount,
            GroupId = group.Id,
            PaidById = userId,
            CreatedAt = DateTime.UtcNow,
            IsSettled = false
        };

        _context.Expenses.Add(expense);
        _context.SaveChanges();

        // ✅ Split the expense equally among members
        var totalMembers = group.Members.Count;
        var splitAmount = expenseDto.Amount / totalMembers;

        foreach (var member in group.Members)
        {
            var payment = new Payment
            {
                ExpenseId = expense.Id,
                UserId = member.UserId,
                Amount = splitAmount,
                IsPaid = member.UserId == userId
            };

            _context.Payments.Add(payment);
        }

        _context.SaveChanges();

        return Ok(new { message = "Expense added and split successfully." });
    }

    [HttpGet("group/{groupName}")]
    public IActionResult GetExpenses(string groupName)
    {
        // ✅ Find group ID using group name
        var group = _context.Groups.FirstOrDefault(g => g.GroupName == groupName);
        if (group == null)
        {
            return NotFound("Group not found.");
        }

        // ✅ Fetch expenses for the group
        var expenses = _context.Expenses
            .Where(e => e.GroupId == group.Id)
            .Select(e => new
            {
                e.Id,
                e.Description,
                e.Amount,
                PaidByName = _context.Users
                    .Where(u => u.Id == e.PaidById)
                    .Select(u => u.FullName)
                    .FirstOrDefault()
            })
            .ToList();

        return Ok(expenses);
    }
}

public class ExpenseCreateDto
{
    public string Description { get; set; }
    public decimal Amount { get; set; }
    public string GroupName { get; set; }  // ✅ Use group name instead of ID
}
