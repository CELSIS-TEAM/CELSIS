#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app/api
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["CELSIS.Api.csproj", ""]
RUN dotnet restore "./CELSIS.Api.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "CELSIS.Api.csproj" -c Debug -o /app/api/build

FROM build AS publish
RUN dotnet publish "CELSIS.Api.csproj" -c Debug -o /app/api/publish 

FROM base AS final
WORKDIR /app/api
COPY --from=publish /app/api/publish .
ENTRYPOINT ["dotnet", "CELSIS.Api.dll"]