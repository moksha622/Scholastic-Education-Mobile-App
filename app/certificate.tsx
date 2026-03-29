import * as Print from "expo-print";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function Certificate() {
  const { subject, lesson, score } = useLocalSearchParams();
  const router = useRouter();

  const userName = "Student"; // later you can make dynamic

  const generatePDF = async () => {
    const html = `
      <div style="text-align:center; padding:40px;">
        <h1 style="color:#58CC02;">🎓 Scholastic Certificate</h1>
        <h2>${userName}</h2>
        <p>has successfully completed</p>
        <h3>${subject} - ${lesson}</h3>
        <p>Score: ${score}/10</p>
        <br/>
        <p>Keep learning and growing 🚀</p>
      </div>
    `;

    await Print.printAsync({ html });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🎉 Your Certificate</Text>

      {/* Certificate Card */}
      <View style={styles.card}>
        <Image
          source={require("../assets/icon.png")}
          style={styles.logo}
        />

        <Text style={styles.certTitle}>SCHOLASTIC</Text>

        <Text style={styles.text}>This certifies that</Text>

        <Text style={styles.name}>{userName}</Text>

        <Text style={styles.text}>has completed</Text>

        <Text style={styles.course}>
          {subject} - {lesson}
        </Text>

        <Text style={styles.score}>Score: {score}/10</Text>

        <Text style={styles.footer}>🚀 Keep Learning Daily</Text>
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.downloadBtn} onPress={generatePDF}>
        <Text style={styles.btnText}>⬇️ Download</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.okBtn}
        onPress={() => router.replace("/")}
      >
        <Text style={styles.btnText}>OK</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },

  card: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    elevation: 5,
  },

  logo: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },

  certTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#58CC02",
  },

  text: {
    marginTop: 10,
    fontSize: 14,
  },

  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,
  },

  course: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },

  score: {
    marginTop: 10,
    fontSize: 16,
    color: "#58CC02",
  },

  footer: {
    marginTop: 20,
    fontSize: 14,
  },

  downloadBtn: {
    backgroundColor: "#58CC02",
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
    alignItems: "center",
  },

  okBtn: {
    backgroundColor: "#888",
    padding: 15,
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 40,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});