Swagger command

```
dotnet swagger tofile --output swagger.json ./bin/Release/net9.0/DaryaBotApi.dll v1
https://localhost:7001/swagger/v1/swagger.json   // raw OpenAPI JSON
https://localhost:7001/swagger                   // interactive UI
dotnet build DaryaBotApi.csproj -c Release
dotnet tool install --global Swashbuckle.AspNetCore.Cli
dotnet tool list -g
dotnet swagger tofile --yaml --output swagger.yaml ./bin/Release/net9.0/DaryaBotApi.dll v1

```
