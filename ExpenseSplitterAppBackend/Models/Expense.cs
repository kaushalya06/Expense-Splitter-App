namespace ExpenseSplitterAppBackend.Models
{
    public class Expense
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public decimal Amount { get; set; }
        public int GroupId { get; set; }
        public Group Group { get; set; }
        public int PaidById { get; set; }
        public User PaidBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsSettled { get; set; }
    }
}
