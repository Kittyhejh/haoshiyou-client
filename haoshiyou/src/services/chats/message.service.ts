import {Injectable} from "@angular/core";
import {Message} from "../../models/models";
import {Observable} from "rxjs/Observable";
import {AngularFireDatabase} from "angularfire2/database";

@Injectable()
export class IMessageService {
  observableMessagesByThreadId(threadId:string):Observable<Message[]> {
    throw "Not implemented";
  }

  createMessage(message:Message):Promise<void> {
    throw "Not implemented";
  }

  observableBadgeCounter(threadId:string, lastCheckTime:number):Observable<number> {
    throw "Not implemented";
  }
}

@Injectable()
export class FirebaseMessageService implements IMessageService {
  constructor(private afdb:AngularFireDatabase) {
  }

  // TODO(xinbenlv): optimize for performance
  observableMessagesByThreadId(threadId:string):Observable<Message[]> {
    return this.afdb.list("/messages", {
      query: {
        orderByChild: 'sentAt'
      }
    }).map(
        (messages:Message[])=> {
          return messages.filter((message:Message)=> {
            return threadId == message.threadId;
          });
        });
  }

  // TODO(xinbenlv): optimize for performance
  observableBadgeCounter(threadId:string, lastCheckTime:number):Observable<number> {
    return this.afdb.list("/messages", {
      query: {
        orderByChild: 'sentAt',
        // TODO(xinbenlv): startAt with a key in AngularFire2
        // is not yet available.
      }
    }).map((messages:Message[])=> {
      return messages.filter((m:Message) => {
        return m.sentAt >= lastCheckTime &&
            (!threadId || threadId == m.threadId); // if ThreadId is not sepecified, count all;
      }).length;
    });
  }

  createMessage(message:Message):Promise<void> {
    if (message.id) {
      return this.afdb.object("/messages/" + message.id).update(message) as Promise<void>;
    } else {
      // TODO(xinbenlv): handle when message.id is not set
      // currently do nothing

      // The following line is uncommented due to compile error.
      // return this.af.database.list("/messages").push(message) as Promise<void>;
    }
  }

}
