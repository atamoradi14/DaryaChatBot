using Azure;
using Azure.AI.OpenAI;
using DaryaBotApi.Models;        // ← your DTO that stores role/text per turn
using Microsoft.Extensions.Options;
using OpenAI.Chat;

namespace DaryaBotApi.Services;

/// <summary>
/// Azure OpenAI wrapper that accepts the full conversation so the model
/// retains context.  Uses ONLY the preview SDK types from Microsoft docs.
/// </summary>
public class AzureOpenAiService
{
    private readonly AzureOpenAIClient _azureClient;   // ← kept unchanged
    private readonly ChatClient _client;
    private readonly string _deployment;
    public record ChatTurn(string Role, string Content);


    public AzureOpenAiService(IOptions<AzureOpenAISettings> settings)
    {
        _deployment = settings.Value.DeploymentName;
        _azureClient = new(
            new Uri(settings.Value.Endpoint),
            new AzureKeyCredential(settings.Value.ApiKey));

        _client = _azureClient.GetChatClient(_deployment);
    }

    /* ----------------------------------------------------------- *
     *  1.  FULL RESPONSE (non-streaming)                          *
     * ----------------------------------------------------------- */
    public async Task<string> GetResponseAsync(IEnumerable<ChatTurn> history)
    {
        // 1️⃣ Convert your DTO turns → SDK ChatMessage list
        List<ChatMessage> sdkMessages = ConvertHistory(history);

        // 2️⃣ Call CompleteChatAsync exactly as in the README
        ChatCompletion completion = await _client.CompleteChatAsync(sdkMessages);

        // 3️⃣ Return first text chunk
        return completion.Content.Count > 0
             ? completion.Content[0].Text
             : "No response.";
    }

    /* ----------------------------------------------------------- *
     *  2.  STREAMING RESPONSE                                     *
     * ----------------------------------------------------------- */
    public async IAsyncEnumerable<string> GetResponseStreamAsync(IEnumerable<ChatTurn> history)
    {
        List<ChatMessage> sdkMessages = ConvertHistory(history);

        await foreach (StreamingChatCompletionUpdate update
            in _client.CompleteChatStreamingAsync(sdkMessages))
        {
            foreach (ChatMessageContentPart part in update.ContentUpdate)
            {
                if (!string.IsNullOrEmpty(part.Text))
                    yield return part.Text;
            }
        }
    }

    /* ----------------------------------------------------------- *
     *  Helper: map your DTO → System/User/Assistant messages      *
     * ----------------------------------------------------------- */
    private static List<ChatMessage> ConvertHistory(IEnumerable<ChatTurn> history)
    {
        var list = new List<ChatMessage>
        {
            // Always inject a system prompt first
            new SystemChatMessage("You are CosmosBot 🌌, a helpful cosmic assistant.")
        };

        foreach (ChatTurn turn in history)
        {
            if (turn.Role == "user")
                list.Add(new UserChatMessage(turn.Content));
            else                       // treat everything else as assistant
                list.Add(new AssistantChatMessage(turn.Content));
        }
        return list;
    }
}
