import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ✅ FIREBASE
import { doc, setDoc } from "firebase/firestore";
import { db } from "../services/db";

export default function Quiz() {
  const params = useLocalSearchParams();
  const subject = params.subject as string;
  const lesson = params.lesson as string;

  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const id = await AsyncStorage.getItem("currentUser");
      setUserId(id);
    };
    loadUser();
  }, []);

  const [answers, setAnswers] = useState<any>({});
  const [locked, setLocked] = useState<any>({});

   const quizData: any = {
    Mathematics: {
      Introduction: [
        { q: "What is mathematics mainly about?", options: ["A. Drawing","B. Numbers and patterns","C. Cooking","D. Painting"], answer: "B" },
        { q: "Which is NOT a branch of mathematics?", options: ["A. Algebra","B. Geometry","C. Cooking","D. Arithmetic"], answer: "C" },
        { q: "Which number type includes negative numbers?", options: ["A. Natural","B. Whole","C. Integers","D. Rational"], answer: "C" },
        { q: "What is 5 + 3?", options: ["A. 6","B. 7","C. 8","D. 9"], answer: "C" },
        { q: "Which operation means repeated addition?", options: ["A. Division","B. Multiplication","C. Subtraction","D. Addition"], answer: "B" },
        { q: "What comes next: 2, 4, 6, 8, __?", options: ["A. 9","B. 10","C. 12","D. 14"], answer: "B" },
        { q: "Which field uses math heavily?", options: ["A. Engineering","B. Art only","C. Singing","D. Dancing"], answer: "A" },
        { q: "What is √2?", options: ["A. Rational","B. Irrational","C. Integer","D. Whole"], answer: "B" },
        { q: "Which step comes first in problem-solving?", options: ["A. Solve","B. Check","C. Understand","D. Guess"], answer: "C" },
        { q: "Mathematics improves:", options: ["A. Memory only","B. Logical thinking","C. Singing skills","D. None"], answer: "B" },
      ],
      Basics: [
        { q: "Which is a prime number?", options: ["A. 4","B. 6","C. 5","D. 8"], answer: "C" },
        { q: "What is 15 − 5?", options: ["A. 5","B. 10","C. 15","D. 20"], answer: "B" },
        { q: "What is 6 × 3?", options: ["A. 9","B. 12","C. 18","D. 21"], answer: "C" },
        { q: "What is 10 ÷ 2?", options: ["A. 2","B. 4","C. 5","D. 6"], answer: "C" },
        { q: "What is 1/2 as decimal?", options: ["A. 0.2","B. 0.5","C. 1.5","D. 2.0"], answer: "B" },
        { q: "Ratio 2:4 simplifies to:", options: ["A. 1:2","B. 2:1","C. 4:2","D. 3:2"], answer: "A" },
        { q: "A right angle is:", options: ["A. 45°","B. 60°","C. 90°","D. 120°"], answer: "C" },
        { q: "Solve: x + 3 = 7", options: ["A. 3","B. 4","C. 5","D. 6"], answer: "B" },
        { q: "A graph used for comparison:", options: ["A. Bar graph","B. Circle","C. Triangle","D. Line"], answer: "A" },
        { q: "Even number example:", options: ["A. 3","B. 5","C. 8","D. 7"], answer: "C" },
      ],
      Advanced: [
        { q: "Solve: 2x + 3 = 7", options: ["A. 1","B. 2","C. 3","D. 4"], answer: "B" },
        { q: "f(x) = x², f(3) = ?", options: ["A. 6","B. 9","C. 12","D. 3"], answer: "B" },
        { q: "Triangle area formula uses:", options: ["A. Length only","B. Width only","C. Base & height","D. Radius"], answer: "C" },
        { q: "sin θ relates to:", options: ["A. Adjacent/hypotenuse","B. Opposite/hypotenuse","C. Opposite/adjacent","D. None"], answer: "B" },
        { q: "Derivative represents:", options: ["A. Area","B. Change","C. Length","D. Angle"], answer: "B" },
        { q: "Probability value range:", options: ["A. 0–1","B. 1–10","C. 10–100","D. Negative only"], answer: "A" },
        { q: "Mean of 2, 4, 6 =", options: ["A. 3","B. 4","C. 5","D. 6"], answer: "B" },
        { q: "Mode of 1,2,2,3 =", options: ["A. 1","B. 2","C. 3","D. None"], answer: "B" },
        { q: "Function gives:", options: ["A. Multiple outputs","B. One output per input","C. No output","D. Random output"], answer: "B" },
        { q: "Calculus is used for:", options: ["A. Drawing","B. Cooking","C. Change & motion","D. Singing"], answer: "C" },
      ],
    },

    Science: {
      Introduction: [
        { q: "Science studies:", options: ["A. Only space","B. Natural world","C. Music","D. Art"], answer: "B" },
        { q: "First step in scientific method:", options: ["A. Experiment","B. Observation","C. Conclusion","D. Analysis"], answer: "B" },
        { q: "Which is a branch of science?", options: ["A. Cooking","B. Biology","C. Drawing","D. Singing"], answer: "B" },
        { q: "Matter is:", options: ["A. Energy only","B. Has mass and space","C. Invisible only","D. Light"], answer: "B" },
        { q: "Gas has:", options: ["A. Fixed shape","B. Fixed volume","C. No fixed shape","D. Solid form"], answer: "C" },
        { q: "Energy is:", options: ["A. Matter","B. Ability to work","C. Object","D. Liquid"], answer: "B" },
        { q: "Plants grow faster with:", options: ["A. Darkness","B. Sunlight","C. Cold","D. Noise"], answer: "B" },
        { q: "Which science studies living things?", options: ["A. Physics","B. Chemistry","C. Biology","D. Astronomy"], answer: "C" },
        { q: "Experiment comes after:", options: ["A. Hypothesis","B. Conclusion","C. Observation","D. Result"], answer: "A" },
        { q: "Science helps improve:", options: ["A. Only memory","B. Critical thinking","C. Drawing","D. Singing"], answer: "B" },
      ],

      Basics: [
        { q: "Matter has:", options: ["A. No mass","B. Mass and volume","C. Only energy","D. Only light"], answer: "B" },
        { q: "Ice melting is:", options: ["A. Chemical","B. Physical","C. Nuclear","D. Biological"], answer: "B" },
        { q: "Burning wood is:", options: ["A. Physical","B. Chemical","C. Mechanical","D. Electrical"], answer: "B" },
        { q: "Atom is:", options: ["A. Largest unit","B. Smallest unit","C. Energy","D. Liquid"], answer: "B" },
        { q: "Cell is:", options: ["A. Machine","B. Life unit","C. Rock","D. Gas"], answer: "B" },
        { q: "Living things:", options: ["A. Do not grow","B. Grow and reproduce","C. Are solid only","D. Are gas"], answer: "B" },
        { q: "Atmosphere is:", options: ["A. Water","B. Land","C. Air layer","D. Rock"], answer: "C" },
        { q: "Heat is:", options: ["A. Object","B. Energy transfer","C. Solid","D. Gas"], answer: "B" },
        { q: "Lever is a:", options: ["A. Machine","B. Animal","C. Plant","D. Gas"], answer: "A" },
        { q: "Electricity flows in:", options: ["A. Air","B. Circuit","C. Water only","D. Soil"], answer: "B" },
      ],

      Advanced: [
        { q: "Force is:", options: ["A. Energy","B. Push or pull","C. Light","D. Heat"], answer: "B" },
        { q: "Newton’s laws relate to:", options: ["A. Heat","B. Motion","C. Sound","D. Light"], answer: "B" },
        { q: "Energy transformation example:", options: ["A. Light → nothing","B. Electrical → light","C. Water → air","D. Rock → gas"], answer: "B" },
        { q: "Chemical reaction produces:", options: ["A. Same substance","B. New substance","C. Energy only","D. Nothing"], answer: "B" },
        { q: "Digestive system helps in:", options: ["A. Breathing","B. Digestion","C. Thinking","D. Moving"], answer: "B" },
        { q: "Food chain shows:", options: ["A. Energy flow","B. Water cycle","C. Air flow","D. Heat"], answer: "A" },
        { q: "Planets move due to:", options: ["A. Heat","B. Gravity","C. Light","D. Air"], answer: "B" },
        { q: "Heat flows:", options: ["A. Cold to hot","B. Hot to cold","C. Same","D. None"], answer: "B" },
        { q: "Magnetism is related to:", options: ["A. Electricity","B. Water","C. Soil","D. Plants"], answer: "A" },
        { q: "AI is part of:", options: ["A. Old science","B. Modern science","C. Biology only","D. Chemistry only"], answer: "B" },
      ],
    },

    English: {
      Introduction: [
        { q: "English is used for:", options: ["A. Drawing","B. Communication","C. Cooking","D. Painting"], answer: "B" },
        { q: "Total letters in English alphabet:", options: ["A. 20","B. 24","C. 26","D. 28"], answer: "C" },
        { q: "Vowel example:", options: ["A. B","B. C","C. A","D. D"], answer: "C" },
        { q: "Noun example:", options: ["A. Run","B. Happy","C. Dog","D. Quickly"], answer: "C" },
        { q: "Verb example:", options: ["A. Eat","B. Blue","C. Table","D. Fast"], answer: "A" },
        { q: "Sentence example:", options: ["A. Happy","B. She runs","C. Quickly","D. Blue"], answer: "B" },
        { q: "Grammar helps to:", options: ["A. Draw","B. Speak correctly","C. Cook","D. Jump"], answer: "B" },
        { q: "Adjective describes:", options: ["A. Action","B. Name","C. Quality","D. Place"], answer: "C" },
        { q: "English helps in:", options: ["A. Only writing","B. Communication","C. Only reading","D. Only listening"], answer: "B" },
        { q: "Communication includes:", options: ["A. Singing","B. Speaking","C. Drawing","D. Painting"], answer: "B" },
      ],

      Basics: [
        { q: "Noun is:", options: ["A. Action","B. Name","C. Description","D. Sound"], answer: "B" },
        { q: "Pronoun replaces:", options: ["A. Verb","B. Noun","C. Adjective","D. Adverb"], answer: "B" },
        { q: "Verb shows:", options: ["A. Name","B. Action","C. Quality","D. Place"], answer: "B" },
        { q: "Adjective describes:", options: ["A. Verb","B. Noun","C. Pronoun","D. Action"], answer: "B" },
        { q: "Present tense example:", options: ["A. Ate","B. Eat","C. Will eat","D. Eating"], answer: "B" },
        { q: "Sentence structure starts with:", options: ["A. Object","B. Subject","C. Verb","D. Adverb"], answer: "B" },
        { q: "“The” is:", options: ["A. Verb","B. Article","C. Noun","D. Pronoun"], answer: "B" },
        { q: "Capital letter used for:", options: ["A. Common words","B. Names","C. Numbers","D. Symbols"], answer: "B" },
        { q: "Question mark used for:", options: ["A. Statement","B. Question","C. Command","D. Exclamation"], answer: "B" },
        { q: "Vocabulary improves by:", options: ["A. Sleeping","B. Reading","C. Ignoring","D. Watching only"], answer: "B" },
      ],

      Advanced: [
        { q: "Complex sentence has:", options: ["A. One idea","B. Two or more ideas","C. No idea","D. Only verb"], answer: "B" },
        { q: "“Because” is:", options: ["A. Noun","B. Verb","C. Conjunction","D. Adverb"], answer: "C" },
        { q: "Active voice example:", options: ["A. Ball was thrown","B. She throws ball","C. Ball thrown","D. Throw ball"], answer: "B" },
        { q: "Passive voice:", options: ["A. She writes","B. Letter was written","C. Write letter","D. Writing"], answer: "B" },
        { q: "Synonym means:", options: ["A. Opposite","B. Similar","C. Different","D. Same spelling"], answer: "B" },
        { q: "Antonym of 'hot':", options: ["A. Warm","B. Cold","C. Fire","D. Heat"], answer: "B" },
        { q: "Skimming means:", options: ["A. Slow reading","B. Quick reading","C. Writing","D. Speaking"], answer: "B" },
        { q: "Reported speech changes:", options: ["A. Words","B. Structure","C. Tense","D. All"], answer: "D" },
        { q: "Fluency relates to:", options: ["A. Writing","B. Speaking smoothly","C. Reading","D. Drawing"], answer: "B" },
        { q: "Good communication needs:", options: ["A. Grammar","B. Clarity","C. Tone","D. All"], answer: "D" },
      ],
    },
  };


  const questions = quizData?.[subject]?.[lesson] ?? [];

  const selectAnswer = (index: number, option: string) => {
    if (locked[index]) return;

    const selected = option.charAt(0);

    setAnswers((prev: any) => ({
      ...prev,
      [index]: selected,
    }));

    setLocked((prev: any) => ({
      ...prev,
      [index]: true,
    }));
  };

  // 🎨 COLOR LOGIC
  const getOptionStyle = (qIndex: number, option: string, correctAnswer: string) => {
    const selected = answers[qIndex];
    const optionLetter = option.charAt(0);

    if (!locked[qIndex]) {
      return styles.option;
    }

    // ✅ Correct answer → GREEN
    if (optionLetter === correctAnswer) {
      return [styles.option, styles.correct];
    }

    // ❌ Wrong selected → RED
    if (selected === optionLetter && selected !== correctAnswer) {
      return [styles.option, styles.wrong];
    }

    return styles.option;
  };

  const handleSubmit = async () => {
    if (!userId) return;

    if (Object.keys(answers).length !== questions.length) {
      Alert.alert("⚠️", "Answer all questions first");
      return;
    }

    // ✅ CALCULATE SCORE
    let score = 0;
    questions.forEach((q: any, i: number) => {
      if (answers[i] === q.answer) score++;
    });

    // ✅ SAVE TO FIREBASE
    await setDoc(doc(db, "results", `${userId}_${lesson}`), {
      score: score,
      passed: score >= questions.length / 2,
    });

    router.push({
      pathname: "/results",
      params: {
        subject,
        lesson,
        answers: JSON.stringify(answers),
      },
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🧠 Quiz</Text>

      {questions.map((q: any, i: number) => (
        <View key={i} style={styles.card}>
          <Text>{q.q}</Text>

          {q.options.map((opt: string, idx: number) => (
            <TouchableOpacity
              key={idx}
              style={getOptionStyle(i, opt, q.answer)}
              onPress={() => selectAnswer(i, opt)}
            >
              <Text style={styles.optionText}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      <TouchableOpacity style={styles.submit} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  title: { fontSize: 26, fontWeight: "bold" },

  card: { marginTop: 15 },

  option: {
    padding: 12,
    backgroundColor: "#eee",
    marginTop: 5,
    borderRadius: 8,
  },

  // ✅ GREEN
  correct: {
    backgroundColor: "#58CC02",
  },

  // ❌ RED
  wrong: {
    backgroundColor: "#ff4d4d",
  },

  optionText: {
    color: "#000",
    fontWeight: "500",
  },

  submit: {
    backgroundColor: "#58CC02",
    padding: 15,
    marginTop: 20,
    borderRadius: 10,
  },

  submitText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});