DAY 4 / AI Eyes, Ears & More / Computer vision, speech AI, and the art of spotting what's real

## Overview
Today we explore how AI perceives the world through cameras and microphones. Computer vision and speech recognition are two of the most widely deployed AI technologies on Earth — from the camera on your phone to Siri to medical imaging. We will also investigate one of the most important challenges of our time: telling AI-generated content from real content.
🎯  Learning Objectives — Day 4
Understand how computer vision works (feature detection, CNNs) / Understand how speech recognition converts audio to text / Explore real-world applications: medical imaging, self-driving cars, translation / Develop critical skills for detecting AI-generated images, text, and audio / Discuss the ethical implications of deepfakes and synthetic media

## Facilitator Schedule
Time | Activity | Materials
0:00–0:10 | Day 3 recap — prompt battle winners share winning prompts | 
0:10–0:45 | Key Concepts: Computer Vision & Speech AI | Projector, demo links ready
0:45–1:15 | Activity 1: Spot the AI — real vs generated media quiz | Printed image sheets or projector
1:15–1:30 | Break | 
1:30–2:00 | Activity 2: Live object detection demo + AI art creation | Laptops, teachablemachine.withgoogle.com or QuickDraw
2:00–2:20 | Discussion: Deepfakes and truth in the AI age | Discussion cards
2:20–2:30 | Reflection | Reflection journal

## Key Concepts
### 1. How Computer Vision Works
Computer vision teaches machines to "see" and interpret images and video. Here is the process:
Input: An image enters the system as a grid of pixels — each pixel is just a number representing colour
Convolution: Filters scan across the image looking for low-level features: edges, corners, curves, colours
Pooling: The AI compresses information, keeping the most important features while reducing complexity
Deep layers: Higher layers combine simple features into complex ones: edge + curve = eye, multiple eyes + nose = face
Classification: The final layer outputs a prediction: "This is a cat with 94% confidence"
This architecture is called a Convolutional Neural Network (CNN). It is the backbone of nearly all modern image AI.
### 2. Computer Vision in the Real World
Application | How It Works
Medical Imaging | AI reads X-rays, MRI scans, and retinal images to detect cancer, diabetic blindness, and bone fractures — often matching or exceeding radiologist accuracy
Self-Driving Cars | Multiple cameras + radar detect roads, signs, pedestrians, and obstacles in real time at 30+ frames per second
Face Unlock | Your phone maps 30,000 infrared dots onto your face to create a mathematical model — impossible to fake with a photo
Instagram/Snapchat Filters | Real-time face landmark detection (68+ points) that tracks your face movement and applies effects precisely
Quality Control | Factories use AI cameras to detect defects in products at speeds impossible for human inspectors
Google Lens | Point your camera at text, objects, plants, or food and AI identifies them instantly

### 3. How Speech Recognition Works
When you speak to Siri or Google Assistant, here is what happens in milliseconds:
Audio capture: Your voice is captured as a waveform — a series of numbers representing sound pressure over time
Feature extraction: The AI analyses frequency patterns, called Mel-frequency cepstral coefficients (MFCCs) — essentially a mathematical fingerprint of each sound
Phoneme recognition: The AI maps audio patterns to phonemes (the basic units of sound in language, e.g. "sh", "ee", "p")
Language model: A language model converts phonemes into words, using context to choose between similar-sounding options ("bare" vs "bear")
Intent recognition: A final layer understands what you actually want and triggers the correct action
### 4. Generative AI & Synthetic Media
The same techniques that help AI recognise faces can be reversed to generate new faces. This is done with Generative Adversarial Networks (GANs):
Generator: Creates fake images, trying to fool the discriminator
Discriminator: Tries to tell real from fake
They compete against each other — as the discriminator gets better, the generator improves, until the fakes are indistinguishable from real.
💡  Why This Matters
Deepfake technology can now create realistic videos of real people saying things they never said. AI can clone a voice from 3 seconds of audio. AI can generate photorealistic images of people who do not exist. This makes media literacy — the ability to critically evaluate what you see and hear — one of the most important skills of your generation.

## Recommended Videos
▶  How Computer Vision Works (3Blue1Brown, 19 min)  —  https://www.youtube.com/watch?v=aircAruvnKk
     The definitive visual explanation of neural networks and image recognition. Worth every minute.
▶  Deepfakes Explained (Vox, 7 min)  —  https://www.youtube.com/watch?v=cQ54GDm1eL0
     Accessible, age-appropriate explainer on synthetic video — excellent for the discussion section.
▶  This Person Does Not Exist (website demo)  —  https://thispersondoesnotexist.com
     Every refresh shows a new photorealistic face — none of them are real. Show on projector for immediate impact.
▶  Google Quick, Draw! (interactive)  —  https://quickdraw.withgoogle.com
     AI guesses your doodles in real time — playful demo of computer vision. Great for the activity section.
## Activity 1 — Spot the AI
📋  Facilitator Instructions
Before class: collect 20 items — a mix of real photos (from news sites), AI-generated images (from Midjourney/DALL-E), real audio clips, and AI-generated voices. / Present each item one at a time. Students write REAL or AI on a response card. / After all 20, reveal answers and discuss the clues that gave each one away. / Key debrief: What patterns did you notice in AI-generated images? (hands, teeth, backgrounds, lighting inconsistencies)

🔍  Student Detective Guide — How to Spot AI-Generated Images
Check These Areas First: / HANDS: AI consistently struggles with fingers — look for extra fingers, merged fingers, or hands that look "melted" / TEETH: AI-generated smiles often have too many teeth, oddly sized teeth, or teeth that blend together / BACKGROUNDS: Background objects often repeat, blur unnaturally, or contain garbled text and impossible architecture / TEXT: Any text in an AI image (signs, labels, newspapers) is almost always garbled nonsense / EARS & HAIR: Ears are often asymmetrical; hair may flow through objects or disappear / LIGHTING: Light sources may be inconsistent — shadows pointing in impossible directions / Tools for Verification: / Google Reverse Image Search — right click any image → "Search image with Google" / AI or Not (aiornot.com) — paste any image URL for instant AI detection / Hive Moderation (hivemoderation.com/deepfake-detection) — free deepfake and AI image detector

## Activity 2 — Live AI Vision Demos
📝  Demo Circuit (rotate groups every 10 minutes)
Station 1: Google Quick, Draw! / Visit quickdraw.withgoogle.com / Draw the prompted object. Watch the AI guess in real time. / Question: How does the AI know what you're drawing before you finish? What features is it detecting? / Station 2: Real-Time Object Detection / Visit teachablemachine.withgoogle.com → Image Project → Standard model / Train it to recognise 3 objects on your desk. Test it on objects from another table. / Question: Did it recognise objects it never trained on? Why or why not? / Station 3: AI Art Generation / Visit Adobe Firefly (firefly.adobe.com) — free, age-appropriate AI image generator / Generate an image using a specific prompt. Then try to recreate the same scene as a drawing. / Question: What details did the AI add that you wouldn't have thought of? What did it get wrong?

## Discussion — Deepfakes and Truth in the AI Age
📋  Facilitator: Run as a structured class discussion (20 minutes)
Split into 3 groups. Each group gets one of the questions below. They discuss for 5 minutes, then present to the class. / No right or wrong answers — the goal is to develop nuanced thinking.

💬  Discussion Questions
Group 1: If deepfakes can make anyone appear to say anything, how do we decide what is true? What are the implications for news, politics, and court cases? / Group 2: Should AI-generated images and videos be required to carry a visible label? Who should be responsible for enforcing this — governments, tech companies, or individuals? / Group 3: Deepfake technology has been used to protect human rights (e.g. disguising activists in dangerous countries) and to harm (e.g. non-consensual fake videos). How should we decide when synthetic media is acceptable?

## Student Reflection — Day 4
📓  Write Your Answers in Your Reflection Journal
In Activity 1, which AI-generated items fooled you the most? What made them convincing? / Describe how a Convolutional Neural Network sees an image differently from how you see it. What can it detect that you might miss? What can you detect that it might miss? / If you received a WhatsApp voice message from a family member asking for money urgently, how would you verify it was really them? Design a 3-step verification process. / Find one real-world example of computer vision being used for good (e.g. in healthcare, conservation, accessibility). Write 2–3 sentences explaining it.

📚  Key Vocabulary — Day 4
Computer Vision: AI that can interpret and understand digital images and video / CNN (Convolutional Neural Network): The standard AI architecture for image recognition / Object Detection: Identifying and locating specific objects within an image / Speech Recognition: AI that converts spoken audio into text / Natural Language Processing (NLP): AI that understands and generates human language / GAN (Generative Adversarial Network): AI architecture where two networks compete to generate realistic synthetic content / Deepfake: AI-generated synthetic media that replaces a real person's likeness or voice / Media Literacy: The ability to critically evaluate and contextualise media content

Figure 4.1 — CNN architecture: how AI reads an image layer by layer