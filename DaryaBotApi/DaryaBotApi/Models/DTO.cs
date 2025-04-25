using static DaryaBotApi.Services.AzureOpenAiService;

namespace DaryaBotApi.Models;

public record ChatHistoryDto(IEnumerable<ChatTurn> Turns);
