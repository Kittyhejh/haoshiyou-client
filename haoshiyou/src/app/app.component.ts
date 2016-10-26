import {Platform} from "ionic-angular";
import {TabsPage} from "../pages/tabs/tabs";
import {Inject, Component} from "@angular/core";
import {Http} from "@angular/http";
import {AuthService} from "../services/auth.service";
import {IMessageService} from "../services/chats/message.service";
import {IThreadService} from "../services/chats/thread.service";
import {IUserService} from "../services/chats/user.service";
import {AngularFire} from "angularfire2";
import {User} from "../models/models";
import {ICredentialService} from "../services/credential.service";
import {NotificationService} from "../services/notfication.service";

declare let ga:any;

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class HaoshiyouApp {

  rootPage:any = TabsPage;
  constructor(private platform:Platform,
              private af:AngularFire,
              private userService:IUserService,
              private threadService:IThreadService,
              private messageService:IMessageService,
              private authService:AuthService,
              private credService:ICredentialService,
              private notificationService:NotificationService,
              private http:Http) {
    this.platform.ready().then(()=> {
      ga('create', this.credService.getCred('GOOGLE_ANALYTICS_PROPERTY_ID'), 'none');
      ga('send', 'pageview');

      if (authService.getUser()) {
        userService.setMeId(AuthService.createHsyUser(authService.getUser()).id);
      }
      // Setup UserService
      authService.userObservable().subscribe((authUser:User) => {
        // TODO(xinbenlv): on condition create user.
        if (!authUser) {
          userService.setMeId(null);
        } // logout
        else { // login
          userService.observableUserById(authUser.id).take(1).toPromise().then((user:User)=> {
            if (!user) {
              userService.createOrUpdateUser(authUser).then(()=> {
                userService.setMeId(authUser.id);
              });
            } else {
              userService.setMeId(user.id);
            }
          });
        }
      });

      // Setup notification
      authService.userObservable().subscribe((user:User)=> {
        if (user == null) {
          this.notificationService.unregister();
        } else {
          this.notificationService.register(user.id).then((regId:string) => {
            if (regId) {
              return this.userService.addRegistrationId(regId);
            } else {
              //this.logger.debug("no regid, return directly");
              return Promise.resolve(); // TODO(xinbenlv): need to do anything special?
            }
          });

        }
      });

    });

  }
}

