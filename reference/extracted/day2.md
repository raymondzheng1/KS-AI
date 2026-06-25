DAY 2 / How AI Learns / Training data, patterns, and your first machine learning experiment

## Overview
Yesterday we discovered that AI is already everywhere. Today we go inside the machine. We will explore how AI actually learns — through data, patterns, and repetition — and then you will train your very own AI model using Google's Teachable Machine. No coding required.
By the end of today, you will understand the full loop of machine learning: collect data → train the model → test it → improve it. This loop is the foundation of almost every AI system on the planet.
🎯  Learning Objectives — Day 2
Explain the machine learning training loop in plain language / Understand what training data, features, labels, and models are / Experience the "sorting exercise" to feel what training data means / Train a real image classifier using Google Teachable Machine / Test the model's accuracy and understand why it makes mistakes

## Facilitator Schedule
Time | Activity | Materials
0:00–0:10 | Recap of Day 1 — quick quiz on key vocabulary | Vocab cards from Day 1
0:10–0:40 | Key Concepts: The ML Training Loop | Whiteboard, printed diagrams
0:40–1:10 | Activity 1: Human Sorting Game (simulate ML training) | Animal picture cards (printed)
1:10–1:25 | Break | 
1:25–2:00 | Activity 2: Teachable Machine — train your own AI | Laptops/tablets with webcam, teachablemachine.withgoogle.com
2:00–2:20 | Share results, discuss where the model failed and why | Whiteboard
2:20–2:30 | Reflection + vocabulary update | Reflection journal

## Key Concepts
### 1. The Machine Learning Training Loop
Every machine learning system follows the same basic cycle. Understanding this loop unlocks your ability to think about any AI system:
Collect Data: Gather thousands (or millions) of examples
Label the Data: Tell the AI what each example is (e.g., "cat" or "dog")
Train the Model: The AI finds mathematical patterns that link examples to labels
Evaluate: Test the model on new examples it has never seen
Improve: Add more data, fix mistakes, retrain — repeat until good enough
Deploy: Release the model to be used in the real world
### 2. What Is a Feature?
A feature is any measurable characteristic the AI uses to make decisions. For example, when recognising a cat:
Pointy ears → a feature
Fur pattern → a feature
Eye shape → a feature
Body size → a feature
The AI doesn't know these are "cat features" until it sees thousands of labelled cat photos and learns which combinations reliably predict "cat."
### 3. Types of Machine Learning
Type | How It Works
Supervised Learning | You provide labelled examples. Most common type. Used for: image recognition, spam filters, voice assistants.
Unsupervised Learning | No labels — AI finds patterns on its own. Used for: customer grouping, anomaly detection.
Reinforcement Learning | AI learns by trial and error, rewarded for good actions. Used for: games, robotics, self-driving cars.
Transfer Learning | Take a pre-trained model and fine-tune it for a new task. Powers most modern AI apps — much faster than training from scratch.

### 4. Overfitting and Underfitting — Why AI Fails
Two of the most common problems in machine learning:
Problem | Explanation
Overfitting | The AI memorises the training examples too perfectly, and fails on any new data. Like a student who memorises textbook answers but can't answer a slightly different question on the exam.
Underfitting | The AI hasn't learned enough. It performs badly even on training data. Like a student who barely studied and gets everything wrong.

💡  The Golden Rule of ML
Good AI generalises. It learns patterns that work on new, unseen data — not just data it has memorised. This is why testing on separate "held-out" data is critical before deploying any AI system.

## Recommended Videos
▶  How Machines Learn (CGP Grey, 10 min)  —  https://www.youtube.com/watch?v=R9OHn5ZF4Uo
     Superb visual explainer of the full ML training process. Watch this before Activity 1.
▶  A Beginner's Guide to Machine Learning (Google, 8 min)  —  https://www.youtube.com/watch?v=nKW8Ndu7Mjw
     Google engineers explain ML with real examples. Excellent follow-up.
▶  Teachable Machine Demo (Google, 3 min)  —  https://www.youtube.com/watch?v=T2qQGqZxkD0
     Official demo video — show this immediately before Activity 2 so students know what to expect.
## Activity 1 — The Human Sorting Game
📋  Facilitator Instructions
Print 40–60 animal images (mix of cats, dogs, birds, fish) on cards. Shuffle them. / Divide students into groups of 4. Each group receives a shuffled set of cards. / Round 1: Without talking, each student sorts the cards into piles — any way they like. / Round 2: Reveal the "correct labels." Students re-sort using the labels. / Discussion: What features did you use to sort? How did having labels change your approach? / Connect to ML: "What you just did manually is exactly what machine learning does automatically — but with millions of examples and millions of features simultaneously."

🎮  Debrief Questions for the Class
What features did you use to tell cats from dogs? What made it hard? / If someone gave you 10,000 of these cards to sort by yourself, would you use the same method? What would you change? / What if some of the labels on the cards were wrong? How would that affect your learning? / Imagine the AI only saw white cats and orange cats. What would happen when it met a black cat for the first time?

## Activity 2 — Teachable Machine: Train Your First AI
📋  Facilitator Setup (prepare before class)
Visit teachablemachine.withgoogle.com — no account needed, works in any browser with a webcam. / Choose "Image Project" → "Standard Image Model." / Walk students through the interface briefly before they start. / Suggested project: Train the AI to recognise 3 hand gestures (thumbs up, peace sign, fist).

📝  Step-by-Step Student Guide
Getting Started / Open teachablemachine.withgoogle.com in your browser / Click "Get Started" → "Image Project" → "Standard Image Model" / Step 1: Collect Your Data (Classes) / Rename "Class 1" to "Thumbs Up" / Click "Webcam" and hold your thumb up — record at least 100 images / Rename "Class 2" to "Peace Sign" — record another 100 images / Click "Add a class" → rename to "Fist" — record another 100 images / Step 2: Train / Click the big "Train Model" button — watch it learn! / After training, the "Preview" panel activates automatically / Step 3: Test and Experiment / Try each gesture in front of the webcam — does it get them right? / Move your hand to a different position, change the lighting, use your other hand — does it still work? / Try tricking it — show a gesture that is halfway between two classes. What does it predict? / Challenge: Improve Your Model / If your model is making mistakes, add more training images from different angles and lighting conditions, then retrain. / Did adding more data improve accuracy? Record your findings.

📊  Student Data Collection Table
Record your results here: / Number of images per class (first attempt): ___ / Accuracy on "thumbs up": ___% | "Peace sign": ___% | "Fist": ___% / Where did your model fail? (describe the situation): ___ / What did you change to improve it?: ___ / Accuracy after improvement: ___% (average across classes) / What do you think would happen if you added a 4th class? Try it!

## Student Reflection — Day 2
📓  Write Your Answers in Your Reflection Journal
Describe the machine learning loop in your own words, as if explaining it to a 10-year-old. / What did you discover when you tried to trick your Teachable Machine model? What does this tell you about AI? / When your model made mistakes, what was usually the cause? Too little data? Bad angle? Wrong lighting? / Think of a real-world AI system (e.g. Spotify recommendations, Google Photos face recognition). What training data do you think it was trained on? / The AI you trained today only took a few minutes. Real AI systems can take weeks of training on thousands of computers. Why do you think that is?

📚  Key Vocabulary — Day 2
Supervised Learning: Training with labelled examples / Training Data: The examples used to teach an AI / Label: The correct answer attached to a training example / Feature: A measurable characteristic the AI uses to make decisions / Model: The mathematical structure the AI builds from training data / Overfitting: Memorising training data too closely, failing on new data / Accuracy: Percentage of correct predictions on test data / Neural Network: A layered mathematical structure loosely inspired by the brain

Figure 2.1 — The ML Training Loop: all 6 stages