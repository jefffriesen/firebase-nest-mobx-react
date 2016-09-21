
import React, { Component, PropTypes } from 'react';

import { Provider, inject } from 'mobx-react';

/* App state and actions */
import ChatStore from './ChatStore';
import AuthStore from './AuthStore';

import MessageList from './MessageList';

export default class ChatApp extends Component {
    componentWillMount() {
        this.stores = {
            chatStore: new ChatStore(),
            authStore: new AuthStore()
        }
    }

    componentWillUnmount() {
        if (this.stores && this.stores.authStore) {
            this.stores.authStore.cleanup();
        }
    }

    render() {
        const subscribeSubs = this.stores.chatStore.subscribeSubs.bind(this.stores.chatStore);
        return (
          <Provider chatStore={this.stores.chatStore}
                    authStore={this.stores.authStore}
                    subscribeSubs={subscribeSubs}>
              <MessageList />
          </Provider>
        )
    }
}
