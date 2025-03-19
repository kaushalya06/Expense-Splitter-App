using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace ExpenseSplitterAppBackend.Data
{
    public class ExpenseSplitterDbContextFactory : IDesignTimeDbContextFactory<ExpenseSplitterDbContext>
    {
        public ExpenseSplitterDbContext CreateDbContext(string[] args)
        {
            // Set base path to the current project directory
            var basePath = Directory.GetCurrentDirectory();

            // Load configuration from appsettings.json located at the project base path
            var configuration = new ConfigurationBuilder()
                .SetBasePath(basePath) // Explicitly set the base path
                .AddJsonFile("appsettings.json") // Load the appsettings.json file
                .Build();

            // Build DbContextOptions
            var optionsBuilder = new DbContextOptionsBuilder<ExpenseSplitterDbContext>();
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            optionsBuilder.UseSqlServer(connectionString);

            return new ExpenseSplitterDbContext(optionsBuilder.Options);
        }
    }
}
