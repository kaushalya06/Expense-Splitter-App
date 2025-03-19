using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExpenseSplitterAppBackend.Models
{
    public class GroupMember
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Group")]
        public int GroupId { get; set; }
        public Group Group { get; set; }

        [Required]
        [ForeignKey("User")]
        public int UserId { get; set; }
        public User User { get; set; }
    }
}
