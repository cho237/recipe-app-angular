1 - Add logout button in header.html
2 - Inject Auth service in header.ts and subscribe to user subject
3 - Add Auth Interceptor in providers AppModule
4 - Inject AuthService in AppComponent.ts and add autoLogin
6 - Add authguard in AppRoutingModule to routes you want to protect
5 - correct redirect url when user not loggedin in authguard