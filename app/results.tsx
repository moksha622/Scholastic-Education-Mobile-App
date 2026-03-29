import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// 🔥 FIREBASE IMPORTS
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth } from "../firebaseConfig";
import { db } from "../services/db";

export default function Results() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const subject = params.subject as string;
  const lesson = params.lesson as string;
  const answers = params.answers as string;

  // ✅ USER LOAD
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    const loadUser = async () => {
      if (auth.currentUser) {
        setUserId(auth.currentUser.uid);
      } else {
        const id = await AsyncStorage.getItem("currentUser");
        setUserId(id);
      }
    };
    loadUser();
  }, []);

  // ✅ USER ANSWERS PARSE
  const userAnswers: { [key: number]: string } = JSON.parse(answers || "{}");

  // ✅ CORRECT ANSWERS
  const correctAnswers: any = {
    Mathematics: {
      Introduction: ["B","C","C","C","B","B","A","B","C","B"],
      Basics: ["C","B","C","C","B","A","C","B","A","C"],
      Advanced: ["B","B","C","B","B","A","B","B","B","C"],
    },
    Science: {
      Introduction: ["B","B","B","B","C","B","B","C","A","B"],
      Basics: ["B","B","B","B","B","B","C","B","A","B"],
      Advanced: ["B","B","B","B","B","A","B","B","A","B"],
    },
    English: {
      Introduction: ["B","C","C","C","A","B","B","C","B","B"],
      Basics: ["B","B","B","B","B","B","B","B","B","B"],
      Advanced: ["B","C","B","B","B","B","B","D","B","D"],
    },
  };

  const questions: string[] = correctAnswers?.[subject]?.[lesson] ?? [];
  let score = 0;

  const resultList = questions.map((ans: string, i: number) => {
    const isCorrect = userAnswers[i] === ans;
    if (isCorrect) score++;
    return {
      index: i,
      correct: isCorrect,
      correctAnswer: ans,
    };
  });

  // ✅ SAVE USER XP AND STREAKS
  useEffect(() => {
    const updateUserStats = async () => {
      if (!userId) return;

      const userDoc = doc(db, "users", userId);
      const snap = await getDoc(userDoc);
      const data = snap.exists() ? snap.data() : { xp: 0, streak: 0, dailyPoints: 0 };

      const newXp = (data?.xp || 0) + score * 10;
      const newDailyPoints = (data?.dailyPoints || 0) + score * 5;
      const newStreak = (data?.streak || 0) + 1;

      await setDoc(userDoc, { xp: newXp, dailyPoints: newDailyPoints, streak: newStreak }, { merge: true });

      await AsyncStorage.setItem(`xp_${userId}`, newXp.toString());
      await AsyncStorage.setItem(`dailyPoints_${userId}`, newDailyPoints.toString());
      await AsyncStorage.setItem(`streak_${userId}`, newStreak.toString());
    };

    updateUserStats();
  }, [score, userId]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🏆 Results</Text>
      <Text style={styles.score}>
        Score: {score}/{questions.length}
      </Text>

      {resultList.map((r: any, i: number) => (
        <View key={i} style={styles.card}>
          <Text>Q{i + 1}: {r.correct ? "✅ Correct" : "❌ Wrong"}</Text>
          {!r.correct && <Text>Correct Answer: {r.correctAnswer}</Text>}
        </View>
      ))}

      <TouchableOpacity
        style={styles.certBtn}
        onPress={async () => {
          if (!userId) return;

          // ✅ SAVE CERTIFICATE
          await setDoc(doc(db, "certificates", `${userId}_${lesson}`), {
            downloaded: true,
            date: new Date(),
          });

          router.push({
            pathname: "/certificate",
            params: { subject, lesson, score },
          });
        }}
      >
        <Text style={{ color: "#fff" }}>🎓 Get Certificate</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold" },
  score: { fontSize: 20, marginVertical: 10, color: "#58CC02" },
  card: { backgroundColor: "#fff", padding: 15, marginTop: 10, borderRadius: 10 },
  certBtn: { marginTop: 20, backgroundColor: "#ff9800", padding: 15, borderRadius: 15, alignItems: "center", marginBottom: 40 },
});