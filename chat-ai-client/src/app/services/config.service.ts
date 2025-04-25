import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';

/**
 * The ConfigService is responsible for getting and setting configuration
 * @class
 */
@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private appConfig: any;
  private httpClient: HttpClient;
  private bUpdateAvailable: Boolean = false;
  private sUpdateAvailableText: string = '';
  public newVersion = new BehaviorSubject(false);


  constructor(private httpBackend: HttpBackend) {

    this.httpClient = new HttpClient(httpBackend);
   }


  async loadAppConfigSync()
  {
    console.log("ConfigService:Loading...")
    this.appConfig = await this.httpClient.get('/assets/config.json?test=' + this.generateGUID()).toPromise();
    console.log("ConfigService:Loaded")
    this.pollForBuildNumber();       
    console.log("ConfigService:Completed") 
    return true;
  }



  // This is an example property ... you can make it however you want.
  get apiUrl() {

    if (!this.appConfig) {

      throw Error('Config file not loaded!');
    }
    return this.appConfig.apiUrl;
  }

  get apiKey() {

    if (!this.appConfig) {

      throw Error('Config file not loaded!');
    }
    return this.appConfig.apiKey;
  }

  get apiVersion() {

    if (!this.appConfig) {

      throw Error('Config file not loaded!');
    }
    return this.appConfig.apiVersion;
  }
  

  private pollForBuildNumber() {

    const pollInterval = 600000; //every hour
    const pollDelay = 60000; //start after 60 secs

    const httpOptions = {
        headers: new HttpHeaders({
            'Cache-Control': 'no-cache'
        })
    };

    timer(pollDelay, pollInterval).subscribe(() => {
        this.httpClient.get<any>('/assets/config.json?test=' + this.generateGUID(), httpOptions).subscribe(

          {
            next : x => {
              console.log('ConfigService:got new assets')
              if (x != null) {         
                let sCurrent = this.apiVersion;
                let sNew = x.apiVersion; 

                if(sCurrent == sNew)
                {
                   this.sUpdateAvailableText = 'Upgrade not available:' + sCurrent;
                  this.newVersion.next(false);
                }
                else
                {
                  this.bUpdateAvailable = true;
                  this.sUpdateAvailableText = 'Upgrade from '+sCurrent+'to ' + sNew+ ' is available';
                  this.newVersion.next(true);
  
                }
    
                console.log("ConfigService:getBatchStatusExt: API call completed");
              }
            },
            error : error => {
              console.log("ConfigService:ERROR getting config" + JSON.stringify(error));
            },
            complete : () => {
              console.log("ConfigService: API call completed");
            }
          });



        
    });
  }

  IsUpdateAvailable()
  {
    return this.bUpdateAvailable;
  }

  IsUpdateAvailableText()
  {
    return this.sUpdateAvailableText;
  }
  
  generateGUID(): string {
    const timestamp = new Date().getTime();
    const randomNum = Math.floor(Math.random() * 1000000);
    return `${timestamp}-${randomNum}`;
  }


}
