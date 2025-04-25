using DaryaBotApi.Models;
using DaryaBotApi.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System;

namespace DaryaBotApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly AzureOpenAiService _aiService;

    public ChatController(AzureOpenAiService aiService)
    {
        _aiService = aiService;
    }

    [HttpPost]
    public async Task<ActionResult<ChatResponse>> Post([FromBody] ChatHistoryDto dto)
    {
        string reply = await _aiService.GetResponseAsync(dto.Turns);
        return Ok(new ChatResponse { Sender = "bot", Text = reply, Timestamp = DateTime.UtcNow });
    }

}
