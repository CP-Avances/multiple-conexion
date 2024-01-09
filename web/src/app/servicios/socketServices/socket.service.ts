import { Injectable } from '@angular/core';
import { SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  public socketConfig: SocketIoConfig = { url: environment.url2, options: {} } ;
  url:string = environment.url;

  setSocketUrl(puerto: any) {
    this.socketConfig.url = this.url+puerto;
  }

  getSocketConfig(): SocketIoConfig {
    if(this.socketConfig == undefined){
      return { url: 'http://192.168.1.15:3002', options: {} }
    }else{
      return this.socketConfig;
    } 
  }
}
