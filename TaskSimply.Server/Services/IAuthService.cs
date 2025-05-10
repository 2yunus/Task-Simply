using TaskSimply.Server.Models.DTOs;

namespace TaskSimply.Server.Services
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(RegisterRequest request);
        Task<AuthResponse> LoginAsync(LoginRequest request);
    }
} 