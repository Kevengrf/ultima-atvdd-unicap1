import { Stack } from "expo-router";

export default function AuthRoutesLayout() {
  // TODO: Implement custom authentication check here
  // if (isSignedIn) return <Redirect href={"/"} />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
