
import MobxFirebaseStore from 'mobx-firebase-store';

import firebase from 'firebase';

const userStr = 'userDetail_';
const allMsgsStr = 'allMsgs';
const allUsersStr = 'allUsers';

export default class ChatStore extends MobxFirebaseStore {
    constructor() {
        super(firebase.database().ref());
    }
    
    //write to firebase
    addMessage({text, uid, timestamp}) {
        return this.fb.child('chat').child('messages').push({text, uid, timestamp})
          .catch(error => {
              throw error.code;
          })
    }

    deleteMessage(messageKey) {
        return this.fb.child('chat').child('messages').child(messageKey).set(null)
          .catch(error => {
              throw error.code;
          });
    }

    //getters
    user(userKey) {
        return this.getData(userStr + userKey);
    }
    allMsgs() {
        return this.getData(allMsgsStr);
    }
    allUsers() {
        return this.getData(allUsersStr);
    }

    allMsgsSubs() {
        return [{
            subKey: allMsgsStr,
            asList: true,
            path: 'chat/messages',

            //nested subscription - subscribe to each message's user
            forEachChild: {
                childSubs: function(messageKey, messageData) {
                    return [{
                        subKey: userStr+messageData.uid,
                        asValue: true,
                        path: 'chat/users/'+messageData.uid
                    }];
                }
            }
        }];
    }
    allUsersSubs() {
        return [{
           subKey: allUsersStr,
           asList: true,
           path: 'chat/users'
        }];
    }
}