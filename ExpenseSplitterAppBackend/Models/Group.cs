namespace ExpenseSplitterAppBackend.Models
{
    public class Group
    {
        public int Id { get; set; }
        public string GroupName { get; set; }
        public ICollection<GroupMember> Members { get; set; }
    }
}
