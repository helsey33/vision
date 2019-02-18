import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image
} from "react-native";
import { Camera, Permissions, Speech } from "expo";
import { MaterialIcons } from "@expo/vector-icons";

export default class CameraExample extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    flash: "on",
    loading: false,
    speaking: false
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  playSound = async audio => {
    try {
      const { sound: soundObject, status } = await Expo.Audio.Sound.createAsync(
        audio,
        { shouldPlay: true }
      );
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
    }
  };

  snap = async () => {
    if (this.camera) {
      this.playSound(require("./../assets/camera-shutter-click-03.mp3"));
      this.setState({
        loading: true
      });
      const mode = this.props.navigation.getParam("mode");
      let photo = await this.camera.takePictureAsync();
      const url = `http://192.168.1.68:5000/api/vision/${mode}`;
      const data = new FormData();
      data.append(`${mode}`, {
        uri: photo.uri,
        type: "image/jpg",
        name: `${mode}`
      });
      fetch(url, {
        method: "post",
        body: data
      })
        .then(res => {
          this.setState({ loading: false });
          let text = res._bodyText;
          if (text === "[]") text = "Sorry! Try again";
          Speech.speak(text, {
            rate: 0.8,
            onStart: () => {
              this.setState({
                speaking: true
              });
            },
            onDone: () => {
              this.setState({
                speaking: false
              });
            }
          });
        })
        .catch(err => {
          this.setState({ loading: false });
          console.log(err);
          Speech.speak("Server is not online!");
        });
    }
  };

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera
            ref={ref => {
              this.camera = ref;
            }}
            style={{ flex: 1 }}
            type={this.state.type}
            flashMode={this.state.flash}
            ratio="16:9"
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "transparent",
                flexDirection: "row"
              }}
            >
              <View style={styles.buttons}>
                <TouchableOpacity
                  onPress={() => {
                    const { type } = this.state;
                    const typeBoolean = type === Camera.Constants.Type.back;
                    Speech.speak(typeBoolean ? "Front Camera" : "Back Camera");
                    this.setState({
                      type: typeBoolean
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back
                    });
                  }}
                >
                  <MaterialIcons name="camera-front" size={30} color="white" />
                </TouchableOpacity>
                {this.state.loading ? (
                  <ActivityIndicator
                    size="large"
                    color="#fff"
                    style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }] }}
                  />
                ) : (
                  <TouchableOpacity onPress={this.snap}>
                    <MaterialIcons name="camera" size={80} color="white" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => {
                    const { flash } = this.state;
                    const flashBoolean = flash === "on";
                    Speech.speak(flashBoolean ? "Flash off" : "Flash on");

                    this.setState({
                      flash: flashBoolean ? "off" : "on"
                    });
                  }}
                >
                  {this.state.flash === "on" ? (
                    <MaterialIcons name="flash-on" size={30} color="white" />
                  ) : (
                    <MaterialIcons name="flash-off" size={30} color="white" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </Camera>
          <View style={{ flex: 1, position: "absolute", height: "100%" }}>
            <Image
              source={require("./../assets/animated-sound-waves.gif")}
              style={{
                ...styles.image,
                display: this.state.speaking ? "flex" : "none"
              }}
            />
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  buttons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
    bottom: 60,
    width: "100%"
  },
  image: {
    flex: 1
  }
});
