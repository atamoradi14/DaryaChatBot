FROM mcr.microsoft.com/dotnet/aspnet:8.0.10 AS base
EXPOSE 80
EXPOSE 8088
ENV INDOCKER=Y
ARG BUILD_TERELEASE=TEST
ENV TERELEASE=$BUILD_TERELEASE

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY *.sln ./
COPY . ./
WORKDIR /src/DaryaBotApi
RUN dotnet restore --force
RUN dotnet build -c Release -o /app

FROM build AS publish
RUN dotnet publish -c Release -o /app

FROM base AS final
WORKDIR /temp
WORKDIR /app
COPY --from=publish /app .
ENV ASPNETCORE_URLS=http://+:80
ENTRYPOINT ["dotnet", "DaryaBotApi.dll"]
