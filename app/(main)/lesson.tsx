import AsyncStorage from "@react-native-async-storage/async-storage";
import { ResizeMode, Video } from "expo-av";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth } from "../../firebaseConfig";
import { db } from "../../services/db";

export default function Lesson() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const subject = Array.isArray(params.subject) ? params.subject[0] : params.subject;
  const lesson = Array.isArray(params.lesson) ? params.lesson[0] : params.lesson;

  // ✅ USER
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    if (auth.currentUser) {
      setUserId(auth.currentUser.uid);
    } else {
      AsyncStorage.getItem("currentUser").then((id) => setUserId(id));
    }
  }, []);

  const key = userId ? `${userId}_${subject}_${lesson}` : null;

  const videoRef = useRef<any>(null);

  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [contentRead, setContentRead] = useState(false);

  const [unlocked, setUnlocked] = useState(false);

  const [streak, setStreak] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [xp, setXp] = useState(0);
  const [dailyPoints, setDailyPoints] = useState(0);

  // RESET WHEN LESSON CHANGES
  useEffect(() => {
    setProgress(0);
    setCompleted(false);
    setUnlocked(false);
    setContentRead(false);
  }, [subject, lesson]);

  // LOAD DATA
  useEffect(() => {
    if (!userId || !key) return;

    const loadData = async () => {
      const saved = await AsyncStorage.getItem(key);
      if (saved) {
        const data = JSON.parse(saved);
        setProgress(data.progress || 0);
        setCompleted(data.completed === true);
      }

      // 🔥 Load Firebase user data
      const userDocRef = doc(db, "users", userId);
      const snap = await getDoc(userDocRef);
      const data = snap.exists() ? snap.data() : { xp: 0, streak: 0, hearts: 5, dailyPoints: 0 };

      setXp(data?.xp || 0);
      setStreak(data?.streak || 0);
      setHearts(data?.hearts || 5);
      setDailyPoints(data?.dailyPoints || 0);
    };

    loadData();
  }, [userId, key]);

  // VIDEO PLAYBACK
  const handlePlayback = async (status: any) => {
    if (!status.isLoaded || !key) return;

    const percent = (status.positionMillis / status.durationMillis) * 100;
    setProgress(percent);

    await AsyncStorage.setItem(key, JSON.stringify({ progress: percent, completed: false }));
  };

  // MARK COMPLETE
  const handleComplete = async () => {
    if (progress < 95 || !userId || !key) return;

    await AsyncStorage.setItem(key, JSON.stringify({ progress: 100, completed: true }));
    setCompleted(true);

    const newXp = xp + 10;
    const newPoints = dailyPoints + 5;
    const newStreak = streak + 1;

    setXp(newXp);
    setDailyPoints(newPoints);
    setStreak(newStreak);

    // 🔥 Save to Firebase
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, { xp: newXp, dailyPoints: newPoints, streak: newStreak }, { merge: true });

    await AsyncStorage.setItem(`xp_${userId}`, newXp.toString());
    await AsyncStorage.setItem(`dailyPoints_${userId}`, newPoints.toString());
    await AsyncStorage.setItem(`streak_${userId}`, newStreak.toString());
  };

  // FINAL UNLOCK LOGIC
  useEffect(() => {
    setUnlocked(progress >= 95 && completed && contentRead);
  }, [progress, completed, contentRead]);

  // CONTENT
  
const lessonContent: any = {


Mathematics: {
      Introduction: `MATHEMATICS INTRODUCTION

🌟 What is Mathematics?

🌟 What is Mathematics?

Mathematics is the study of numbers, quantities, patterns, structures, and relationships. It is a universal language used to describe and understand the world around us. From simple counting to complex space exploration, mathematics plays a crucial role in every aspect of life.

Mathematics is not just about calculations—it is about logical thinking, problem-solving, and reasoning.

🧠 Why Learn Mathematics?

• Develops logical and analytical thinking
• Improves problem-solving skills
• Essential for science, technology, engineering, and economics
• Helps in everyday tasks like budgeting, shopping, and time management
• Builds discipline and accuracy

📚 Branches of Mathematics

• Arithmetic – Study of numbers and basic operations
• Algebra – Study of symbols and equations
• Geometry – Study of shapes and space
• Trigonometry – Study of angles and triangles
• Calculus – Study of change and motion
• Statistics & Probability – Study of data and uncertainty

🔢 Numbers: The Foundation

Mathematics begins with numbers. There are different types:

• Natural Numbers: 1, 2, 3, 4...
• Whole Numbers: 0, 1, 2, 3...
• Integers: ..., -2, -1, 0, 1, 2...
• Rational Numbers: 1/2, 3/4
• Irrational Numbers: √2, π
• Real Numbers: All numbers combined

➕ Basic Operations

• Addition (+) → combining values
• Subtraction (−) → finding difference
• Multiplication (×) → repeated addition
• Division (÷) → splitting into equal parts

🔍 Patterns in Mathematics

Mathematics is full of patterns:

Example:
2, 4, 6, 8 → adding 2 each time

Patterns help in:

• Predicting outcomes
• Solving problems faster
• Understanding sequences

🧩 Problem-Solving in Math

Steps:

1.Understand the problem
2.Plan a strategy
3.Solve it
4.Check your answer

🌍 Real-Life Applications

• Banking & finance
• Engineering & architecture
• Medicine & science
• Computer programming
• Daily life decisions

🧠 Key Skills Developed

• Logical reasoning
• Critical thinking
• Accuracy
• Creativity in problem-solving
`,

      Basics: `MATHEMATICS BASICS

🔢 Understanding Numbers Deeply

Numbers are the building blocks of mathematics.

Types:
• Even Numbers: divisible by 2
• Odd Numbers: not divisible by 2
• Prime Numbers: only divisible by 1 and itself
• Composite Numbers: more than 2 factors

Example:

• Prime: 2, 3, 5
• Composite: 4, 6, 8

➕ Operations with Examples

Addition

Example: 12 + 8 = 20

Subtraction

Example: 15 − 7 = 8

Multiplication

Example: 6 × 4 = 24

Division

Example: 20 ÷ 5 = 4

📊 Fractions

Fractions represent parts of a whole.

Example: 1/2, 3/4

• Numerator → top number
• Denominator → bottom number

🔄 Decimals

Decimals are another way to represent fractions.

Example:
1/2 = 0.5
3/4 = 0.75

📏 Ratios & Proportions

Ratio: comparison of two quantities
Example: 2:3

Proportion: equality of ratios
Example: 2/3 = 4/6

📐 Basic Geometry

• Point → exact location
• Line → straight path
• Angle → formed by two lines

Types of angles:

• Acute (<90°)
• Right (=90°)
• Obtuse (>90°)

📉 Simple Algebra

Using variables:

x + 5 = 10
x = 5

📊 Data & Graphs

• Bar graphs
• Line graphs
• Pie charts

Used to represent data visually.

💡 Real-Life Example

If a pen costs $2:
Buying 3 pens → 2 × 3 = $6`,

      Advanced: `MATHEMATICS ADVANCED

🧠 Algebra (Advanced)

Expressions:
2x + 3

Equations:
2x + 3 = 7 → x = 2

📈 Functions

A function relates input to output.

Example:
f(x) = x²


math-basic-1 .png image

math-basic-2.png image


📐 Geometry (Advanced)

Area of Triangle


math-basic-3 .png image

math-basic-4 .png image


Example:
b = 4, h = 6
A = 12


📊 Trigonometry

Study of angles and triangles

Basic ratios:

• sin θ = opposite/hypotenuse
• cos θ = adjacent/hypotenuse
• tan θ = opposite/adjacent

🔁 Calculus Introduction

• Derivatives → rate of change
•Integrals → area under curve

Example:
Speed = change in distance over time

📉 Probability

Chance of an event:

math-ad-1.png image
	​

📊 Statistics

• Mean (average)
• Median (middle value)
• Mode (most frequent)

Example:
2, 4, 4, 6
Mean = 4

💡 Real-Life Applications

• AI & machine learning
• Engineering systems
• Finance predictions
• Physics simulations
`,
    },

    Science: {
      Introduction: `SCIENCE INTRODUCTION

🌟 What is Science?

Science is the systematic study of the natural world through observation, experimentation, and reasoning. It helps us understand how things work—from the smallest atoms to the vast universe.

Science is not just facts—it is a process of discovery.

🧠 Why Learn Science?

• Develops curiosity and critical thinking
• Helps understand the environment and universe
• Improves problem-solving skills
• Essential for careers in medicine, engineering, and technology
• Helps make informed decisions in daily life

🔍 Branches of Science

• Physics – Study of matter, energy, and forces
• Chemistry – Study of substances and reactions
• Biology – Study of living organisms
• Earth Science – Study of Earth, weather, and environment
• Astronomy – Study of space and celestial bodies

🔬 Scientific Method

The scientific method is a step-by-step process:

1.Observation
2.Question
3.Hypothesis (prediction)
4.Experiment
5.Analysis
6.Conclusion

🧪 Example of Scientific Method

Problem: Why do plants grow faster in sunlight?

• Hypothesis: Plants grow faster with more sunlight
• Experiment: Place plants in sunlight and shade
• Result: Sunlight plants grow faster
• Conclusion: Sunlight helps plant growth

⚛️ Basic Concepts

Matter

Anything that has mass and occupies space.

Examples:

• Water
• Air
• Rock

Energy

Ability to do work.

Types:

• Heat energy
• Light energy
• Electrical energy

🔄 States of Matter

• Solid → fixed shape
• Liquid → takes container shape
• Gas → spreads freely

🌍 Science in Daily Life

• Cooking → chemical reactions
• Electricity → physics
• Medicine → biology
• Weather → earth science

🧠 Skills Developed Through Science

• Observation
• Logical reasoning
• Experimentation
• Data analysis
`,

      Basics: `SCIENCE BASICS

⚛️ Matter and Its Properties

Matter is everything around us.

Properties:

• Mass
• Volume
• Density

🔄 Physical vs Chemical Changes

Physical Change
• No new substance
  Example: Ice melting

Chemical Change
• New substance formed
  Example: Burning wood

⚡ Energy Types

• Kinetic Energy → motion
• Potential Energy → stored energy
• Thermal Energy → heat
• Electrical Energy → electricity

🧪 Atoms and Molecules

• Atom → smallest unit of matter
• Molecule → group of atoms

Example:
H₂O = water

🧬 Cells (Biology Basics)

Cells are the basic units of life.

Types:

• Plant cells
• Animal cells

🌱 Living vs Non-Living

Living:

• Grow
• Reproduce
• Need energy

Non-living:

• Do not grow
• Do not reproduce

🌍 Earth and Environment

• Atmosphere → air layer
• Hydrosphere → water
• Lithosphere → land

🌡️ Heat and Temperature

• Heat → energy transfer
• Temperature → measure of hotness

💡 Simple Machines

• Lever
• Pulley
• Wheel

Used to make work easier.

🔋 Electricity Basics

• Current → flow of electrons
• Circuit → path of current
`,

      Advanced: `SCIENCE ADVANCED

⚛️ Advanced Physics Concepts

Force and Motion

• Force → push or pull
• Newton’s Laws explain motion

Example:
A ball moves when kicked

⚡ Laws of Motion

1.Object stays at rest unless acted upon
2.Force = mass × acceleration
3.Every action has equal reaction

🔋 Energy Transformation

Energy can change forms:

Example:
Electrical → Light (bulb)

🧪 Advanced Chemistry
Chemical Reactions

Reactants → Products

Example:
Hydrogen + Oxygen → Water

🧬 Advanced Biology

Human Body Systems

• Digestive system
• Respiratory system
• Circulatory system

🌍 Ecosystems

• Living + non-living interaction
• Food chain

Example:
Plant → Herbivore → Carnivore

🌌 Space Science

• Planets orbit the Sun
• Gravity controls motion

🌡️ Thermodynamics

Study of heat and energy

•Heat flows from hot to cold

⚡ Electricity & Magnetism

• Magnetic fields
• Electric currents create magnetism

🤖 Modern Science Applications

• Artificial Intelligence
• Space exploration
• Medical technology
`,
    },

    English: {
      Introduction: `ENGLISH INTRODUCTION

🌟 What is English?

English is a global language used for communication in education, business, science, and everyday life. It helps people from different countries understand each other.

English includes:

• Speaking
• Listening
• Reading
• Writing

It is not just a subject—it is a communication skill.

🧠 Why Learn English?

• Communicate with people worldwide
• Access global education and information
• Improve career opportunities
• Understand books, movies, and media
• Build confidence in communication

🔤 The English Alphabet

English has 26 letters:

• Vowels: A, E, I, O, U
• Consonants: Remaining 21 letters

🔊 Sounds and Pronunciation

Each letter has sounds.

Example:

• A → /æ/ (cat)
• B → /b/ (bat)

Pronunciation helps in:

• Speaking clearly
• Understanding others

📝 Words and Their Types

Words are the building blocks of language.

Types of words:

• Nouns → names (dog, city)
• Verbs → actions (run, eat)
• Adjectives → describe (big, happy)
• Adverbs → describe actions (quickly)

📖 Sentences

A sentence is a group of words with meaning.

Example:

• She is happy.

Types:

• Statement
• Question
• Command
• Exclamation

🧩 Basic Grammar Concept

Grammar is the rule system of language.

Example:
Incorrect: She go to school
Correct: She goes to school

🗣️ Communication Skills

English helps in:

• Speaking clearly
• Listening carefully
• Writing correctly

🌍 English in Daily Life

• School learning
• Social media
• Emails
• Travel communication

🧠 Skills Developed

• Vocabulary
• Reading comprehension
• Writing clarity
• Speaking confidence`,

      Basics: `ENGLISH BASICS

🔤 Parts of Speech

1. Noun

Names of people, places, things
Example: Teacher, city

2. Pronoun

Replaces nouns
Example: He, she, it

3. Verb

Action words
Example: Run, eat

4. Adjective

Describes nouns
Example: Big, small

5. Adverb

Describes verbs
Example: Quickly

📝 Tenses (Basic)

- Present Tense

She eats

- Past Tense

She ate

- Future Tense

She will eat

📖 Sentence Structure

Basic format:
Subject + Verb + Object

Example:
She eats an apple

🔗 Articles

• A / An → general
• The → specific

Example:
A cat (any cat)
The cat (specific cat)

🔤 Capitalization

Use capital letters for:

• Names
• Start of sentence
• Places

✍️ Punctuation

• Full stop (.)
• Comma (,)
• Question mark (?)
• Exclamation (!)

📚 Vocabulary Building

Ways to improve:

• Reading books
• Learning new words
• Using dictionary

🗣️ Speaking Basics

• Clear pronunciation
• Simple sentences
• Practice daily

✍️ Writing Basics

• Correct grammar
• Proper punctuation
• Clear ideas
`,

      Advanced: `ENGLISH ADVANCED

🧠 Advanced Grammar

Complex Sentences

Combine ideas:

Example:
Although it was raining, she went outside.

🔗 Conjunctions

Words that join sentences:

• And
• But
• Because
• Although

📖 Active vs Passive Voice

Active:
She wrote a letter

Passive:
A letter was written by her

🧾 Reported Speech

Direct:
She said, “I am happy.”

Indirect:
She said that she was happy

📚 Advanced Vocabulary

• Synonyms → similar meaning
• Antonyms → opposite meaning

Example:
Happy ↔ Sad

🧠 Reading Skills

• Skimming → quick reading
• Scanning → finding information
• Detailed reading

✍️ Writing Skills

• Essays
• Emails
• Reports

🗣️ Speaking Skills

• Fluency
• Confidence
• Tone and expression

🎯 Communication Mastery

• Clear message
• Correct grammar
• Proper tone

🌍 Real-Life Applications

• Job interviews
• Academic writing
• Public speaking
• Online communication
`,
    },

      };


  // VIDEO SOURCES
  
const videoMap: any = {
    Mathematics: {
      Introduction: require("../../assets/videos/math_intro.mp4"),
      Basics: require("../../assets/videos/math_basics.mp4"),
      Advanced: require("../../assets/videos/math_advanced.mp4"),
    },
    Science: {
      Introduction: require("../../assets/videos/science_intro.mp4"),
      Basics: require("../../assets/videos/science_basics.mp4"),
      Advanced: require("../../assets/videos/science_advanced.mp4"),
    },
    English: {
      Introduction: require("../../assets/videos/english_intro.mp4"),
      Basics: require("../../assets/videos/english_basics.mp4"),
      Advanced: require("../../assets/videos/english_advanced.mp4"),
    },
  };


  const videoSource = videoMap?.[subject]?.[lesson];

  return (
    <ScrollView
      style={styles.container}
      onScroll={({ nativeEvent }) => {
        const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
        const isEnd =
          layoutMeasurement.height + contentOffset.y >=
          contentSize.height - 20;
        if (isEnd) setContentRead(true);
      }}
      scrollEventThrottle={200}
    >
      <Text style={styles.title}>📘 {subject} - {lesson}</Text>

      <Text>❤️ Hearts: {hearts}</Text>
      <Text>⭐ XP: {xp}</Text>
      <Text>🏆 Daily Points: {dailyPoints}</Text>
      <Text>🔥 Streak: {streak}</Text>

      <View style={styles.videoCard}>
        <Video
          ref={videoRef}
          source={videoSource}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          style={styles.video}
          onPlaybackStatusUpdate={handlePlayback}
        />
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progress, { width: `${progress}%` }]} />
      </View>

      <Text>{Math.floor(progress)}% watched</Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: progress >= 95 ? "#58CC02" : "#ccc" }]}
        onPress={handleComplete}
      >
        <Text style={styles.btnText}>Mark Complete</Text>
      </TouchableOpacity>

      {completed && <Text style={styles.done}>🎉 Completed</Text>}

      <View style={styles.contentCard}>
        <Text style={styles.contentText}>
          {lessonContent?.[subject]?.[lesson] || "No content"}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: unlocked ? "#58CC02" : "#ccc" }]}
        disabled={!unlocked}
        onPress={() => router.push({ pathname: "/quiz", params: { subject, lesson } } as any)}
      >
        <Text style={styles.btnText}>🧠 Get Quiz</Text>
      </TouchableOpacity>

      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold" },
  videoCard: { marginVertical: 10 },
  video: { width: "100%", height: 200 },
  progressBar: { height: 10, backgroundColor: "#eee", marginVertical: 10 },
  progress: { height: "100%", backgroundColor: "#58CC02" },
  button: { padding: 15, borderRadius: 10, marginTop: 10 },
  btnText: { color: "#fff", textAlign: "center" },
  done: { color: "green", textAlign: "center" },
  contentCard: { marginTop: 20, backgroundColor: "#fff", padding: 15 },
  contentText: { fontSize: 16 },
});