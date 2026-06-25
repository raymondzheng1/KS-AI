DAY 8 / Build Day 1 / From canvas to code — bringing your AI project to life

## Overview
Today is pure building. Teams work on their chosen project track, supported by facilitators and peer collaboration. The goal by end of day: a working prototype — even a rough one — that demonstrates your core idea.
Remember the Design Thinking principle: a bad prototype you can test beats a perfect plan you can only imagine. Done is better than perfect on Day 8.
🎯  Day 8 Goals
Have a working proof-of-concept by end of day / Identify the biggest technical or design challenge in your project / Test your prototype with at least one person outside your team / Document what works, what doesn't, and what you'll fix tomorrow

## Build Schedule
Time | Activity | Materials
0:00–0:15 | Stand-up: each team shares their Day 8 goal in 60 seconds | Project plans from Day 7
0:15–1:15 | Build Sprint 1 — core functionality | Laptops, all tools available
1:15–1:30 | Break + peer check-in (show your progress to another team) | 
1:30–2:15 | Build Sprint 2 — refine + test with someone outside your team | 
2:15–2:25 | End-of-day demo: show what exists, no matter how rough | Projector or shared screen
2:25–2:30 | Reflection — what works, what's broken, tomorrow's plan | 

## Track A — Smart Chatbot Build Guide
📋  Tools: Claude.ai or ChatGPT (free tier) + Google Docs to record outputs
A "smart chatbot" for a specific purpose is built through a carefully crafted system prompt — the instruction that defines who the AI is, what it knows, and how it should behave.

📝  System Prompt Template for Your Chatbot
Copy this template and fill in the [brackets]: / You are [name], an AI assistant specialising in [topic]. You help [target user] with [specific task]. / Your personality is [3 adjectives — e.g. warm, patient, encouraging]. / Rules you always follow: / Only answer questions related to [topic]. For other topics, politely redirect. / Always [key behaviour — e.g. show your working step by step]. / Never [prohibited behaviour — e.g. give the answer directly without explanation]. / If you are unsure, say so clearly and suggest where the user could find a reliable answer. / Always end your response with a follow-up question to check understanding. / Test your system prompt: paste it into Claude or ChatGPT as the first message, then have a classmate try to use your chatbot. Does it behave as intended?

## Track B — Image Classifier App Build Guide
📝  Step-by-Step: Teachable Machine → Embedded Web App
Phase 1: Train Your Model (30 min) / Plan your classes: what 3–4 categories will your classifier recognise? / Collect training images: minimum 100 per class, from multiple angles, lighting, backgrounds / Train on Teachable Machine (teachablemachine.withgoogle.com) / Evaluate accuracy — aim for 85%+ before proceeding / Phase 2: Export and Embed (30 min) / Click "Export Model" → "Tensorflow.js" → "Upload my model" → copy the model URL / Open a new file called index.html on your computer / Paste in the Teachable Machine sample code from the "Code snippets" section / Replace the placeholder model URL with yours / Open index.html in your browser — it should work immediately / Phase 3: Customise (30 min) / Change the page title, add a description of what your classifier does / Add a friendly message when each class is detected / Share your index.html file with another team and let them test it

## Track C — AI Story Generator Build Guide
📝  Build: Interactive AI Branching Story
Concept: The player makes choices. Each choice is fed back into the AI prompt to generate the next scene. / Phase 1: Story Architecture (20 min) / Choose a setting and premise: e.g. "You are a young scientist in 2080 who discovers an AI that has gained emotions" / Map your story tree: 3 chapters, each with 2 choices. That's 8 possible story paths. / Write the world-building context (2–3 paragraphs) that the AI will use as background / Phase 2: System Prompt Design (20 min) / Write a system prompt that sets the tone: "You are a narrative AI for an interactive science fiction story. The tone is [adjective]. Always end each scene with exactly 2 choices formatted as: CHOICE A: [option] | CHOICE B: [option]" / Test it: does the AI maintain consistency? Does it remember previous choices? / Phase 3: User Interface (40 min) / Create a simple Google Slides or PowerPoint presentation / Slide 1: Opening scene (paste AI-generated text). Add 2 buttons linking to Slide 2A or 2B. / Each branch slide: generate that scene from the AI using the choice as context / Continue for 3 chapters — you will have approximately 14 slides total

## Track D — AI Research Assistant Build Guide
📝  Build: A Research Prompt System
Concept: Design a series of prompts that help a student research any topic responsibly. / The 5-Prompt Research System — design each prompt: / SCOPE PROMPT: "Given the research question [X], break it into 5 specific sub-questions that together would fully answer it." / SOURCES PROMPT: "For the sub-question [Y], suggest 5 types of sources I should look for. Include at least 2 primary source types." / SUMMARISE PROMPT: "Here is text I found [paste source text]. Summarise the key points relevant to [sub-question]. Flag any claims that need verification." / BIAS CHECK PROMPT: "Analyse this summary for potential bias, missing perspectives, or unsupported claims: [paste summary]." / SYNTHESIS PROMPT: "Using these verified points [list], write a 3-paragraph evidence-based response to [original research question]. Cite each point." / Test your system: use it to research a topic you actually need for school. Does it produce better research than googling alone?

## Daily Build Log — Student Worksheet
📓  Complete This at the End of Day 8
Team: ___ | Track: ___ / What did we complete today? (be specific) / What is working well? / What is NOT working yet? (list all known issues) / What feedback did we get from our test user? / What are our top 3 priorities for Day 9? / What help do we need from the facilitator tomorrow?
