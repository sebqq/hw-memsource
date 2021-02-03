import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";

require("jest-fetch-mock").enableFetchMocks;
jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);
jest.mock("react-native/Libraries/Animated/src/NativeAnimatedHelper");
jest.mock("@react-navigation/native", () => {
  return {
    ...jest.requireActual("@react-navigation/native"),
    useNavigation: () => ({
      navigate: jest.fn(),
      addListener: jest.fn(),
    }),
  };
});
