# Chapter Creation Guidelines

This document provides a comprehensive guide for creating new chapters (2-6) for the AI Learning Hub. The goal is to ensure consistency in tone, structure, and quality, while preserving the existing UI/UX patterns established in Chapter 1.

## 1. Core Philosophy: Educating the User

Our primary goal is to empower non-profit professionals by making AI accessible, practical, and directly applicable to their work.

- **From Theory to Practice:** Start with high-level concepts and progressively move to actionable steps and real-world tools.
- **Build Confidence:** Demystify jargon and complex topics. The user should feel capable and confident in their ability to use AI.
- **Context is Key:** Every concept should be framed within the context of the non-profit sector's unique challenges and opportunities.

## 2. Tone and Voice

The tone should be consistent across all content to build a trusting relationship with the user.

- **Conversational & Accessible:** Use "you" and write in a direct, friendly manner. Avoid overly academic or technical language.
- **Empathetic & Encouraging:** Acknowledge the challenges non-profit professionals face. Be a supportive guide.
- **Practical & Action-Oriented:** Focus on what the user can *do* with the information. Provide clear, actionable insights.

## 3. Content Structure (The Learn & Apply Lesson)

Each lesson should follow this narrative structure to create a cohesive learning experience:

1.  **Hook:** Start with an engaging opening that connects the topic to the user's everyday work.
2.  **Context (Learn):** Explain *why* this topic is important for a non-profit professional. Introduce the core concepts and strategies.
3.  **Application (Apply):** Provide a hands-on, interactive element that allows the user to apply what they've learned. This should be the centerpiece of the lesson.
4.  **Engagement Point (Lyra Chat):** Use a `lyra_chat` element to prompt discussion about the application exercise and answer questions.
5.  **Synthesis:** Conclude with key takeaways and a bridge to the next lesson.

## 4. Content Pacing and Formatting

- **Text Blocks:** Keep paragraphs concise, ideally between 150-300 words per `text` block.
- **Interactive Spacing:** Introduce an interactive element every 3-4 content blocks to maintain engagement.
- **Callout Boxes:** Use the `callout_box` element to highlight key statistics, definitions, or important notes.
- **Lesson Duration:** Aim for an estimated duration of 15-25 minutes per lesson.

## 5. Image Usage

Visuals are essential for breaking up text and illustrating concepts.

- **Type:** Use the `image` content block type.
- **Placeholder:** When a final image is not ready, use `public/placeholder.svg`.
- **Alt Text:** Always provide descriptive `alt` text in the metadata for accessibility.
- **Style:** Images should be clean, modern, and relevant to the content. Simple diagrams, charts, or illustrative icons are preferred over stock photos.

## 6. Interactive Elements

Interactive elements are the core of the learning experience. They are not just for testing, but for active learning and engagement.

- **Available Types:**
    - `lyra_chat`: For personalized discussion and content blocking.
    - `knowledge_check`: For multiple-choice questions to check understanding.
    - `reflection`: For open-ended questions to prompt personal application.
    - `sequence_sorter`: For ordering steps in a process.
    - `multiple_choice_scenarios`: For applying knowledge to realistic situations.
    - `callout_box`: For highlighting key information.

- **Placement:** Integrate these elements logically within the lesson flow to reinforce the concepts being taught.

## 7. Lyra Chat: The AI Mentor

The `lyra_chat` element is the most important interactive component.

- **Content Blocking:** The first `lyra_chat` in a lesson **must** be configured with `blockingEnabled: true`. This is a core UI/UX pattern. Content following this chat will be hidden until the user has a meaningful interaction (minimum 3 exchanges).
- **Contextual Prompts:** The initial prompt for the chat should be directly related to the preceding content, inviting the user to discuss their own challenges or ideas.
- **Chat Type:** Use `"chatType": "persistent"` to ensure conversations are saved and can be reviewed later.

## 8. Preserving the UI/UX

**This is a critical requirement.** The existing UI and UX must be maintained for all new chapters. Do not introduce new layouts or modify core components.

- **Follow the Pattern:** Adhere strictly to the established layout:
    - `LessonHeader`
    - `LessonContent`
    - `ContentBlockRenderer`
    - `InteractiveElementRenderer`
    - `ChapterCompletion`
- **No New Components:** All content and interactions can be built using the existing component library and the database-driven content system. No new React components should be necessary to create a chapter.
- **Database-Driven:** All chapter content, including text, images, and interactive elements, is driven by inserts into the Supabase database. New chapters are created by adding rows to the `chapters`, `lessons`, `content_blocks`, and `interactive_elements` tables.
