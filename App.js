import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground
} from "react-native";
import { Speech } from "expo";
import { createStackNavigator, createAppContainer } from "react-navigation";

import Camera from "./components/Camera";

class Home extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            Speech.speak("object");
            this.props.navigation.navigate("Camera", { mode: "object" });
          }}
          style={{ height: "33%" }}
        >
          <ImageBackground
            source={require("./assets/objects.jpeg")}
            style={{ width: "100%", height: "100%" }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Speech.speak("text");
            this.props.navigation.navigate("Camera", { mode: "text" });
          }}
          style={{ height: "33%" }}
        >
          <ImageBackground
            source={require("./assets/text.jpeg")}
            style={{ width: "100%", height: "100%" }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Speech.speak("label");
            this.props.navigation.navigate("Camera", { mode: "label" });
          }}
          style={{ height: "34%" }}
        >
          <ImageBackground
            source={require("./assets/label.jpeg")}
            style={{ width: "100%", height: "100%" }}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const AppStackNaigator = createStackNavigator(
  {
    Home,
    Camera: {
      screen: Camera,
      navigationOptions: () => ({
        gesturesEnabled: true
      })
    }
  },
  {
    headerMode: "none"
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "column"
  }
});

export default createAppContainer(AppStackNaigator);
