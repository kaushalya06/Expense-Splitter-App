using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ExpenseSplitterAppBackend.Data;
using ExpenseSplitterAppBackend.Models;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

[Authorize]
[ApiController]
[Route("api/groups")]
public class GroupController : ControllerBase
{
    private readonly ExpenseSplitterDbContext _context;

    public GroupController(ExpenseSplitterDbContext context)
    {
        _context = context;
    }

    // ✅ Create a new group with members
    [HttpPost("create")]
    public IActionResult CreateGroup([FromBody] GroupCreateDto groupDto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value); // Get logged-in user ID

        var group = new Group
        {
            GroupName = groupDto.GroupName,
            Members = new List<GroupMember>()
        };

        // Ensure the creator is also added as a member
        var creator = _context.Users.Find(userId);
        if (creator == null)
        {
            return Unauthorized("User not found.");
        }

        group.Members.Add(new GroupMember { Group = group, User = creator });

        foreach (var memberEmail in groupDto.MemberEmails)
        {
            var user = _context.Users.SingleOrDefault(u => u.Email == memberEmail);
            if (user == null)
            {
                return BadRequest($"User with email {memberEmail} not found.");
            }

            group.Members.Add(new GroupMember { Group = group, User = user });
        }

        _context.Groups.Add(group);
        _context.SaveChanges();

        return Ok(new { message = "Group created successfully!", groupId = group.Id });
    }

    // ✅ Get all groups for the logged-in user (with members)
    [HttpGet("user-groups")]
    public IActionResult GetUserGroups()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

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

        return Ok(groups);
    }
}

// ✅ DTO for Group Creation
public class GroupCreateDto
{
    public string GroupName { get; set; }
    public List<string> MemberEmails { get; set; }
}
