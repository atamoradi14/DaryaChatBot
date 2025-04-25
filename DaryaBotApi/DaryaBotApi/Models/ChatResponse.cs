using System;

namespace DaryaBotApi.Models;

public class ChatResponse
{
    public string Sender { get; set; } = "bot";
    public string? Text { get; set; }
    public string? ImageUrl { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
