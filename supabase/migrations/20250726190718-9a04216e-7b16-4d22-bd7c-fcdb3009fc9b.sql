-- Add content blocks for Chapter 1 lessons

-- Lesson 1 Content Blocks
INSERT INTO public.content_blocks (id, lesson_id, type, title, content, order_index, is_visible, is_active)
VALUES 
(1, 1, 'introduction', 'Welcome to Your AI Journey!', 
'<div class="space-y-4">
<p class="text-lg">Meet Sarah, a nonprofit director just like you. Three months ago, she was overwhelmed with emails, struggling to write compelling fundraising content, and spending hours on tasks that felt repetitive. Today? She has an AI companion named Lyra who helps her work smarter, not harder.</p>
<p>You''re about to meet that same AI companion. But this isn''t just any chatbot – Lyra is specifically designed to understand the unique challenges of nonprofit work and help you navigate them with confidence.</p>
<div class="bg-gradient-to-r from-primary/10 to-brand-cyan/10 p-4 rounded-lg border-l-4 border-primary">
<p class="font-medium">What makes Lyra special?</p>
<ul class="mt-2 space-y-1 text-sm">
<li>• She understands nonprofit terminology and challenges</li>
<li>• She adapts her communication style to match yours</li>
<li>• She learns about your organization and mission</li>
<li>• She provides practical, actionable guidance</li>
</ul>
</div>
</div>', 1, true, true),

(2, 1, 'callout', 'Your First Mission', 
'<p>In this lesson, you''ll have your first real conversation with Lyra. She''ll ask about your nonprofit work, your challenges, and your goals. Think of this as a friendly getting-to-know-you chat that will help her provide better assistance throughout your learning journey.</p>', 2, true, true),

-- Lesson 2 Content Blocks  
(3, 2, 'introduction', 'AI as Your Creative Partner', 
'<div class="space-y-4">
<p class="text-lg">Remember when you first learned to ride a bike? You needed training wheels to build confidence before you could ride freely. That''s exactly what we''re doing with AI – building your confidence through fun, creative experiences that show you what''s possible.</p>
<p>Today, you''ll collaborate with AI to create some delightful content that''s uniquely yours. These aren''t just fun exercises – they''re confidence builders that demonstrate how AI can be your creative partner in nonprofit work.</p>
<div class="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg border-l-4 border-emerald-500">
<p class="font-medium text-emerald-800">Why start with creative projects?</p>
<ul class="mt-2 space-y-1 text-sm text-emerald-700">
<li>• Low stakes = high confidence building</li>
<li>• Immediate, tangible results you can see and share</li>
<li>• Experience the collaborative nature of AI</li>
<li>• Discover your personal AI communication style</li>
</ul>
</div>
</div>', 1, true, true),

(4, 2, 'tip', 'Pro Tip: Be Specific!', 
'<p>The more specific details you provide about your nonprofit, the more personalized and relevant your AI-generated content will be. Don''t just say "education" – say "after-school tutoring for elementary students in rural communities."</p>', 2, true, true),

-- Lesson 3 Content Blocks
(5, 3, 'introduction', 'The Art of Talking to AI', 
'<div class="space-y-4">
<p class="text-lg">You wouldn''t ask a colleague "make me something" and expect great results. The same applies to AI. The difference between getting mediocre AI output and genuinely helpful results often comes down to how you communicate your needs.</p>
<p>Think of AI as a brilliant intern who knows a lot but needs clear direction. The better you get at providing that direction, the more valuable AI becomes in your nonprofit work.</p>
<div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-blue-500">
<p class="font-medium text-blue-800">The 4 Elements of Great AI Prompts:</p>
<ul class="mt-2 space-y-1 text-sm text-blue-700">
<li>• <strong>Context:</strong> What''s the situation or background?</li>
<li>• <strong>Task:</strong> What specifically do you want created?</li>
<li>• <strong>Audience:</strong> Who is this for?</li>
<li>• <strong>Style:</strong> What tone or format do you want?</li>
</ul>
</div>
</div>', 1, true, true),

(6, 3, 'example', 'Before and After Example', 
'<div class="grid md:grid-cols-2 gap-4">
<div class="bg-red-50 border border-red-200 rounded-lg p-4">
<h4 class="font-medium text-red-800 mb-2">❌ Weak Prompt</h4>
<p class="text-sm text-red-700 italic">"Write a fundraising email"</p>
</div>
<div class="bg-green-50 border border-green-200 rounded-lg p-4">
<h4 class="font-medium text-green-800 mb-2">✅ Strong Prompt</h4>
<p class="text-sm text-green-700 italic">"Write a warm, compelling fundraising email for our literacy program donors, highlighting our recent success story of Maria, a single mother who completed her GED. The tone should be heartfelt and include a clear call-to-action for our year-end campaign."</p>
</div>
</div>', 2, true, true),

-- Lesson 4 Content Blocks
(7, 4, 'introduction', 'Your AI-Powered Future Begins', 
'<div class="space-y-4">
<p class="text-lg">Congratulations! You''ve taken the first steps into a world where AI amplifies your nonprofit''s impact. You''ve chatted with Lyra, created content together, and learned to communicate effectively with AI.</p>
<p>But this is just the beginning. The next chapters will show you how to apply these skills to real nonprofit challenges – from writing compelling grant proposals to creating engaging social media content to analyzing donor data for insights.</p>
<div class="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border-l-4 border-purple-500">
<p class="font-medium text-purple-800">What''s Next in Your Journey:</p>
<ul class="mt-2 space-y-1 text-sm text-purple-700">
<li>• Chapter 2: AI-Powered Communication & Outreach</li>
<li>• Chapter 3: Grant Writing & Fundraising with AI</li>
<li>• Chapter 4: Social Media & Marketing Automation</li>
<li>• Chapter 5: Data Analysis & Insights</li>
<li>• Chapter 6: Building Your AI Toolkit</li>
</ul>
</div>
</div>', 1, true, true),

(8, 4, 'reflection', 'Take a Moment to Reflect', 
'<p>Before you continue your journey, take a moment to think about what you''ve learned about AI and about yourself as an AI collaborator. Lyra will help you process these insights and set intentions for the chapters ahead.</p>', 2, true, true)

ON CONFLICT (id) DO UPDATE SET 
  lesson_id = EXCLUDED.lesson_id,
  type = EXCLUDED.type,
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  order_index = EXCLUDED.order_index,
  is_visible = EXCLUDED.is_visible,
  is_active = EXCLUDED.is_active;