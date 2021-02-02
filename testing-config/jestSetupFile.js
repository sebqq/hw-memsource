import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";

require("jest-fetch-mock").enableFetchMocks;
jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);
jest.mock("react-native/Libraries/Animated/src/NativeAnimatedHelper");
