using ExpenseSplitterAppBackend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ExpenseSplitterAppBackend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/payment")]
    public class PaymentController : ControllerBase
    {
        private readonly ExpenseSplitterDbContext _context;

        public PaymentController(ExpenseSplitterDbContext context)
        {
            _context = context;
        }

        [HttpPost("pay")]
        public IActionResult Pay([FromBody] PaymentDto paymentDto)
        {
            // ✅ Extract authenticated user's ID from JWT token
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            // ✅ Find the user's payment record for the expense
            var payment = _context.Payments
                .SingleOrDefault(p => p.ExpenseId == paymentDto.ExpenseId && p.UserId == userId);

            if (payment == null)
            {
                return NotFound("Payment record not found.");
            }

            if (payment.IsPaid)
            {
                return BadRequest("This payment has already been marked as paid.");
            }

            // ✅ Mark payment as paid
            payment.IsPaid = true;
            _context.SaveChanges();

            // ✅ Check if all payments for the expense have been settled
            var allPaymentsForExpense = _context.Payments
                .Where(p => p.ExpenseId == paymentDto.ExpenseId)
                .ToList(); // Ensure we're working with an in-memory list

            if (allPaymentsForExpense.Count > 0 && allPaymentsForExpense.All(p => p.IsPaid))
            {
                // ✅ Mark the expense as settled
                var expense = _context.Expenses.SingleOrDefault(e => e.Id == paymentDto.ExpenseId);
                if (expense != null)
                {
                    expense.IsSettled = true;
                    _context.SaveChanges();
                }
            }

            return Ok(new { message = "Payment marked as paid." });
        }
    }

    public class PaymentDto
    {
        public int ExpenseId { get; set; }
    }

}
