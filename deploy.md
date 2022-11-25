### DB:
- Run docker container
> docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=[password]" -p 1433:1433 -d [mcr.microsoft.com/mssql/server:2019-latest](http://mcr.microsoft.com/mssql/server:2019-latest) --name celsisdb
- Then conect to server using any convenient tool for it (i am using JetBrains DataGrip or Microsoft SMSS). Make sure you have checked Trust server certificate
- Create new DB with name CELSIS_DB
- In appsettings.json (appsettings.Development.json for debug) change ConnectionStrings.DefaultConnection to 
> "Server=localhost, 1433; Database=CELSIS_DB; Trusted_Connection=False; User Id=sa; Password=[password]; TrustServerCertificate=True"
- Then you can use script CELSIS.Api/Data/SQLScripts/InitialScript.sql to create tables in DB
- Should work (i hope)

### Project:
1. local_path_to_solution/CELSIS >> SSH >> vm_path_to_solution/CELSIS
2. cd vm_path_to_solution/CELSIS/CELSIS.Api
3. sudo docker build -t celsisapi .
4. sudo docker run -d -p 8080:80 --name celsisapi celsisapi 
5. cd vm_path_to_solution/CELSIS/CELSIS.Web/ClientApp
6. sudo docker build -t celsisweb .
7. sudo docker run -d -p 80:80 --name celsisweb celsisweb
8. Check: sudo docker ps
