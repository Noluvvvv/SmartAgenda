using Microsoft.EntityFrameworkCore;
using SmartAgenda.Api.Models;

namespace SmartAgenda.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Evento> Eventos => Set<Evento>();
    public DbSet<Rotina> Rotinas => Set<Rotina>();
    public DbSet<Usuario> Usuarios => Set<Usuario>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Usuario>(u =>
        {
            u.Property(x => x.Nome).IsRequired().HasMaxLength(150);
            u.Property(x => x.Email).IsRequired().HasMaxLength(200);
            u.HasIndex(x => x.Email).IsUnique();
        });

        modelBuilder.Entity<Evento>(e =>
        {
            e.Property(x => x.Titulo).IsRequired().HasMaxLength(150);
            e.HasOne(x => x.Rotina)
             .WithMany(r => r.Eventos)
             .HasForeignKey(x => x.RotinaId)
             .OnDelete(DeleteBehavior.SetNull);
            e.HasOne(x => x.Usuario)
             .WithMany(u => u.Eventos)
             .HasForeignKey(x => x.UsuarioId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Rotina>(r =>
        {
            r.Property(x => x.Titulo).IsRequired().HasMaxLength(150);
            r.HasOne(x => x.Usuario)
             .WithMany(u => u.Rotinas)
             .HasForeignKey(x => x.UsuarioId)
             .OnDelete(DeleteBehavior.Cascade);
        });
    }
}