import "react-native-gesture-handler";
import React from "react";
import { enableScreens } from "react-native-screens";

import RootStack from "./src/navigation/RootStack";
import { StoreProvider } from "./src/mobx/useStore";

enableScreens();

const App: React.FC = () => {
  return (
    <StoreProvider>
      <RootStack />
    </StoreProvider>
  );
};

export default App;
