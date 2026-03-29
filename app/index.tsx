import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity
} from "react-native";

export default function WelcomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // 🔥 PREMIUM SPLASH (Duolingo Style)
  if (loading) {
    return (
      <LinearGradient
        colors={["#4A90E2", "#6FC3FF"]}
        style={styles.splashContainer}
      >
        <Image
          source={require("../assets/images/splash.png")}
          style={styles.splashImage}
          resizeMode="contain"
        />

        <Text style={styles.splashText}>Scholastic</Text>
      </LinearGradient>
    );
  }

  // ✅ MAIN SCREEN
  return (
    <LinearGradient
      colors={["#4A90E2", "#6FC3FF"]}
      style={styles.container}
    >
      <Text style={styles.title}>Scholastic</Text>
      <Text style={styles.subtitle}>
        Your Academic Learning App
      </Text>

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={() => router.push("/signup")}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  // 🔵 SPLASH
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  splashImage: {
    width: 220,
    height: 220,
    marginBottom: 20,
  },

  splashText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },

  // 🏠 MAIN SCREEN
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#fff",
  },

  subtitle: {
    fontSize: 16,
    color: "#fff",
    marginTop: 10,
    opacity: 0.9,
  },

  button: {
    marginTop: 40,
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 3,
  },

  buttonText: {
    color: "#4A90E2",
    fontWeight: "bold",
    fontSize: 16,
  },
});