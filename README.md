## My decisions

Text below describes some of tooling and decisions that I've used/made during this app development.


### App state management - Mobx-state-tree

I've decided to use *Mobx-state-tree* as state management library, because it was one of the thing (Mobx) that Memsource uses in their application as it was mentioned during interview. This was my first experience with Mobx and I have to say that I've really grow to like Mobx-state-tree during this experience in some ways.

I really like composition-before-inheritance approach, as it shares same ideology as React components. I've used composition in order to create api-requestable models. This allowed to preserve DRY principle and simplify code in Model's actions that serves for API calls.

In order to persist authorized user credentials I've decided to use AsyncStorage to store access token and token's expiration time.

### Navigation

Combination of *react-navigation* and *react-native-screens* was used in order to make navigation work. I've decided to use react-native-screen's *NativeStackNavigator*, because my stacks doesn't need any extra customizations. This ensures, that App's navigation will be native-like in terms of both - performance and looks. 


### Performance optimization

While implementing Lists in this app, I didn't optimize my code too much. I've demonstrated some `useCallback()` hooks in order to keep function refs equal between re-renders. Actually, there is much that one can do in order to optimize list performance in React Native. I've documented some of these things directly in List components. After all, I'm not fan of premature optimizations.


### Static type-checking

I've decided go with *TypeScript*. Personally, I use *TypeScript* in every project that I'm working one so this one was no-brainer for me.


### Tests

I've implemented mostly unit and integration tests. For these tests I'm using combination of Jest and react-native-testing-library by Callstack. I've also tried to implement end-to-end tests, but I was not able to find proper guide to end-to-end testing in Expo. I was trying to use Detox but it just didn't work well with Expo.

If I was using bare React Native for this app, then I would most probably make end-to-end tests for:

1. ProjectList -> ProjectInfo -> (delete this project from dashboard) -> Refresh this project and get Error message -> Go back on ProjectList and check if this project was removed.
2. Manipulations of "Due" filter widget on ProjectListScreen.

Also, if we are talking about production grade application, then it would be nice to connect this project to some CI/CD tools.


### More Info

You can find more info about decisions that I've made directly in code. I've tried to comment not only code itself, but also some IMHO interesting low-level decissions right there.