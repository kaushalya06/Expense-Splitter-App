namespace ExpenseSplitterAppBackend.Models
{
    public class Payment
    {
        public int Id { get; set; }
        public int ExpenseId { get; set; }
        public Expense Expense { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public decimal Amount { get; set; }  // Amount owed by the user
        public bool IsPaid { get; set; } = false;
    }
}
