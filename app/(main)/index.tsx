import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity
} from "react-native";

// ✅ FIREBASE
import { getUserData } from "../../services/db";

export default function Home() {
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);

  const [streak, setStreak] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [xp, setXp] = useState(0);
  const [dailyPoints, setDailyPoints] = useState(0);

  useEffect(() => {
    const loadUser = async () => {
      const id = await AsyncStorage.getItem("currentUser");
      setUserId(id);
    };
    loadUser();
  }, []);

  // ✅ LOAD FROM FIREBASE
  const loadData = async (uid: string) => {
    const data = await getUserData(uid);

    if (!data) return;

    setXp(data.xp || 0);
    setHearts(data.hearts || 5);
    setStreak(data.streak || 0);
    setDailyPoints(data.dailyPoints || 0);
  };

  useEffect(() => {
    if (userId) loadData(userId);
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      if (userId) loadData(userId);
    }, [userId])
  );

  const subjects = [
    { name: "Mathematics", image: require("../../assets/images/Math.jpg"), emoji: "📐" },
    { name: "Science", image: require("../../assets/images/science.jpg"), emoji: "🔬" },
    { name: "English", image: require("../../assets/images/english.jpeg"), emoji: "📖" },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🔥 My Courses</Text>

      <Text>❤️ {hearts}</Text>
      <Text>⭐ {xp}</Text>
      <Text>🏆 {dailyPoints}</Text>
      <Text>🔥 {streak}</Text>

      {subjects.map((item) => (
        <TouchableOpacity
          key={item.name}
          style={styles.card}
          onPress={() =>
            router.push({
              pathname: "/(main)/courses",
              params: { subject: item.name, userId },
            } as any)
          }
        >
          <ImageBackground source={item.image} style={styles.image}>
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.75)"]}
              style={styles.overlay}
            >
              <Text style={styles.cardText}>
                {item.emoji} {item.name}
              </Text>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: "bold" },
  card: { height: 150, marginTop: 15, borderRadius: 20, overflow: "hidden" },
  image: { flex: 1 },
  overlay: { flex: 1, justifyContent: "flex-end", padding: 15 },
  cardText: { color: "#fff", fontSize: 22, fontWeight: "bold" },
});