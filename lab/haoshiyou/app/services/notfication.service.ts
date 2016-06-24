// app/services/auth/auth.ts

import {Platform} from "ionic-angular";
import {Injectable, Inject} from "@angular/core";
import {loggerToken} from "./log.service";
import {Logger} from "log4javascript/log4javascript";
import {ICredentialService} from "./credential.service";
import {Http, Headers, RequestOptions} from "@angular/http";

@Injectable()
export class NotificationService {
  public static TOPIC_LISTING:string = "listing";
  private registrationId:string;
  private push:any/* PushNotification, no typed definition yet. */;

  constructor(private platform:Platform,
              @Inject(loggerToken) private logger:Logger,
              private credService:ICredentialService,
              private http:Http) {
    this.logger.info("NotificationService init");
  }

  register(meId:string):Promise<string> {
    this.logger.info("Try register push notification");
    return this.platform.ready().then(() => {
      if (typeof PushNotification === "undefined") {
        this.logger.info("Not setting up push notification since there is no PushNotification");
        return Promise.resolve(null);
      } else {
        return new Promise<string>((resolve, reject)=> {
          this.logger.info("Registering push notification");
          let coreOpt = {
            "senderID": this.credService.get("FCM_SENDER_ID"),
            "topics": [NotificationService.TOPIC_LISTING]
          };
          if (meId) {
            //coreOpt["topics"] = [`user:${meId}`]; // TODO(xinbenlv): add group support
          }
          let opt;
          if (this.platform.is('android')) {
            coreOpt["icon"] = "icon";
            opt = {
              "android": coreOpt
            };
          } else if (this.platform.is('ios')) {
            coreOpt["gcmSandbox"] = true; // without sandbox it will not be able to received out.
            coreOpt["alert"] = true;
            coreOpt["badge"] = true;
            coreOpt["sound"] = true;
            opt = {
              "ios": coreOpt
            }
          }
          this.logger.info(`Registering up push notification using opt=${JSON.stringify(opt)}`);
          this.push = PushNotification.init(opt);
          this.push.on('registration', (data) => {
            this.logger.info(`Push notification registration completed: registrationId=${data.registrationId}`);
            this.registrationId = data.registrationId;
            resolve(data.registrationId);
          });
          this.push.on('notification', (data) => {
            // TODO(xinbenlv): add navigate to specific thread;
            this.logger.info(`Received data from push notification: ${JSON.stringify(data)}`);
          });
          this.push.on('error', (e) => {
            this.logger.error('Push notification error!', e);
            reject(e);
          });

        });
      }


    });
  }

  unregister():Promise<void> {
    this.logger.info("Try unregister push notification");
    if (typeof PushNotification === "undefined") {
      this.logger.info("Not unregistering because PushNotification is undefined");
      return Promise.resolve();
    } else {
      this.logger.info("Unregistering push notificaiton");
      return new Promise((resolve, reject) => {
        this.push.unregister(resolve, reject);
      }).then(() => {
        this.logger.info("Done unregistering push notificaiton");
      });
    }
  }

  sendPushMessage(regIds:string[], msg:string, userName:string):Promise<any> {
    let url = 'https://fcm.googleapis.com/fcm/send';
    let body = JSON.stringify({
      "registration_ids":regIds,
      "notification":{
        "title": `好室友(haoshiyou)`,
        "body":`${userName}: ${msg}`
      }
    });
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization':`key=${this.credService.get('FCM_KEY')}`
    });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(url, body, options).take(1).toPromise().then((ret)=>{
      this.logger.info(ret);
    }).catch((e)=>{
      this.logger.warn(e);
    });
  }

  sendTopicMessage(topic:string, msg:string):Promise<any> {
    let url = 'https://fcm.googleapis.com/fcm/send';
    let body = JSON.stringify({
      "to": `/topics/${topic}`,
      "notification": {
        "title": `好室友(haoshiyou)`,
        "body": msg
      }
    });
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `key=${this.credService.get('FCM_KEY')}`
    });
    let options = new RequestOptions({headers: headers});
    return this.http.post(url, body, options).take(1).toPromise().then((ret)=> {
      this.logger.info(ret);
    }).catch((e)=> {
      this.logger.warn(e);
    });
  }
}