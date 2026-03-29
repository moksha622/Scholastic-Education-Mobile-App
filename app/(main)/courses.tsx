import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Courses() {
  const { subject } = useLocalSearchParams();
  const router = useRouter();

  const lessons = ["Introduction", "Basics", "Advanced"];

  const getEmoji = (lesson: string) => {
    if (lesson === "Introduction") return "🚀";
    if (lesson === "Basics") return "📘";
    if (lesson === "Advanced") return "🔥";
    return "📚";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📚 {subject} Course</Text>

      {lessons.map((lesson) => (
        <TouchableOpacity
          key={lesson}
          style={styles.card}
          activeOpacity={0.85}
          onPress={() =>
            router.push({
              pathname: "/(main)/lesson",
              params: { subject, lesson },
            } as any)
          }
        >
          <LinearGradient
            colors={["#58CC02", "#89E219"]}
            style={styles.gradient}
          >
            <Text style={styles.emoji}>
              {getEmoji(lesson)}
            </Text>

            <Text style={styles.text}>{lesson}</Text>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F7FA",
  },

  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },

  card: {
    marginBottom: 18,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 5,
  },

  gradient: {
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
  },

  emoji: {
    fontSize: 32,
    marginBottom: 10,
  },

  text: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
});