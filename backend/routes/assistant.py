import os
import re
from flask import Blueprint, request, jsonify

assistant_bp = Blueprint('assistant', __name__)

# Predefined Knowledge Base for Fast, Deterministic, and Offline-Resilient Responses
KNOWLEDGE_BASE = [
    {
        "patterns": [r"\bwho\b.*\b(created|made|built|developer|author|pragya)\b", r"\bpragya\b", r"\babout the creator\b"],
        "reply": "🌱 **EcoCode Challenge was conceived and built by Pragya** as an educational platform to gamify green software engineering. Pragya designed it to help developers understand how computational efficiency, algorithm optimization, and clean architecture directly reduce real-world energy consumption and carbon emissions!",
        "suggestions": ["What are the 8 green coding lessons?", "How does code consume electricity?", "How do I earn a certificate?"]
    },
    {
        "patterns": [r"\bcertificate\b", r"\bcertification\b", r"\bdiploma\b", r"\bdegree\b"],
        "reply": "🎓 **Certificate of Green Software Engineering**:\nYou can unlock your verified digital certificate by completing all 8 lessons in the **Learn** section!\n\nOnce completed, go to your **Profile** or **Dashboard** to view and download your verified SVG/PNG certificate featuring your name, date, and earned EcoPoints to share on LinkedIn or GitHub.",
        "suggestions": ["Take me to Lessons", "How do I earn EcoPoints?", "What are Badges?"]
    },
    {
        "patterns": [r"\bcarbon inspector\b", r"\bswd\b", r"\bwebsite audit\b", r"\bco2\b", r"\bfootprint\b"],
        "reply": "🌍 **Website Carbon Inspector**:\nOur Carbon Inspector uses the internationally recognized **Sustainable Web Design (SWD)** model:\n\n`E = (Transfer Weight GB × 0.81 kWh/GB) × Carbon Intensity (442 gCO₂/kWh)`\n\nIt queries **The Green Web Foundation** to verify if the host runs on 100% renewable energy, audits payload compression (Brotli/Gzip), and estimates tree equivalents required to offset emissions.",
        "suggestions": ["How to reduce website payload?", "What is green web hosting?", "How to enable Brotli compression?"]
    },
    {
        "patterns": [r"\bpython\b.*\b(optimi|energy|green|efficient|fast)\b", r"\bpython.*loop\b"],
        "reply": "🐍 **Green Python Best Practices**:\n1. **Use Generators over Lists**: Use `(x for x in data)` instead of `[x for x in data]` to avoid loading millions of elements into RAM.\n2. **Leverage Built-ins**: Functions like `map()`, `filter()`, `sum()`, and `any()` run in optimized C under CPython.\n3. **Use Sets for Lookups**: `item in my_set` runs in **O(1)** time vs **O(n)** for lists, saving millions of CPU cycles.\n4. **Slot Classes**: Define `__slots__ = ('x', 'y')` in models to bypass `__dict__` overhead and save up to 40% memory.",
        "suggestions": ["JavaScript green tips", "C++ efficiency tips", "Java green tips"]
    },
    {
        "patterns": [r"\bjavascript\b.*\b(optimi|green|fast|efficient)\b", r"\bjs\b.*\b(energy|memory)\b"],
        "reply": "⚡ **Green JavaScript & Web Best Practices**:\n1. **Debounce & Throttle**: Never run heavy logic on raw `scroll` or `resize` events.\n2. **Avoid Memory Leaks**: Clear timers (`clearInterval`) and unbind event listeners on component unmount.\n3. **Virtualize Long Lists**: Render only visible DOM nodes (e.g. `react-window` / `virtual-scroller`).\n4. **Offload Heavy Work**: Use **Web Workers** for compute-intensive tasks so the main UI thread stays idle and energy-efficient.",
        "suggestions": ["How does DOM reflow waste power?", "Python green tips", "What is EcoCode Challenge?"]
    },
    {
        "patterns": [r"\bjava\b.*\b(green|efficient|optimi)\b"],
        "reply": "☕ **Green Java Best Practices**:\n1. **Minimize Heap Allocations**: Heavy object creation causes frequent Garbage Collection (GC) pauses that spike CPU wattage.\n2. **Primitive Collections**: Prefer primitive arrays or collections like Eclipse Collections/Trove over boxed `Integer`/`Double`.\n3. **String Builder**: Always avoid string concatenation in loops (`str += x`). Use `StringBuilder` or pre-sized buffers.\n4. **Virtual Threads (Project Loom)**: Use lightweight virtual threads for I/O instead of heavyweight platform threads.",
        "suggestions": ["C++ green tips", "Python green tips", "Try a coding challenge"]
    },
    {
        "patterns": [r"\bc\+\+\b.*\b(green|efficient|fast|energy)\b", r"\bcpp\b"],
        "reply": "⚙️ **Green C++ Best Practices**:\n1. **Cache Locality**: Store elements contiguously in `std::vector` instead of node-based `std::list` to maximize CPU L1/L2 cache hits.\n2. **Move Semantics & RVO**: Pass heavy objects via `std::move` and enable Return Value Optimization (RVO) to eliminate deep copies.\n3. **Compile-time Computation**: Use `constexpr` and template metaprogramming to compute values at build time rather than runtime.\n4. **Smart Pointers**: Rely on RAII and `std::unique_ptr` for zero-overhead deterministic memory deallocation.",
        "suggestions": ["Python green tips", "Java green tips", "What is Big-O energy impact?"]
    },
    {
        "patterns": [r"\benergy\b", r"\bconsume\b", r"\bpower\b", r"\belectricity\b", r"\bwhy.*green\b"],
        "reply": "🔋 **Why Green Software Matters**:\nData centers and cloud infrastructure currently consume over **1-2% of global electricity**, rivaling the aviation industry!\n\nWhen code runs inefficient algorithms (e.g., $O(n^2)$ vs $O(n)$):\n- CPU cores remain pinned at 100% capacity\n- Server cooling demand increases\n- High battery drain occurs on client devices\nWriting optimized code directly curtails this invisible carbon footprint.",
        "suggestions": ["What is the SWD model?", "Check Website Carbon", "Start Lesson 1"]
    },
    {
        "patterns": [r"\bquiz\b", r"\bquizzes\b", r"\btest\b"],
        "reply": "📝 **Quizzes & EcoPoints**:\nHead to the **Quizzes** section to test your knowledge across 5 categories: Green Web, Energy Efficiency, Cloud Architecture, Sustainable Algorithms, and Hardware Impacts.\n\nScoring **≥80%** rewards you with bonus EcoPoints and sparks a celebration!",
        "suggestions": ["Start a Quiz", "View Leaderboard", "What are Daily Challenges?"]
    },
    {
        "patterns": [r"\bchallenge\b", r"\bcompiler\b", r"\beditor\b", r"\blanguage\b"],
        "reply": "💻 **Coding Challenges & Multi-Language Editor**:\nOur platform features daily green coding challenges with a live **Monaco Code Editor**!\n\nYou can code in **Python (`.py`)**, **JavaScript (`.js`)**, **Java (`.java`)**, or **C++ (`.cpp`)**. Test your solution against benchmark energy metrics and unlock verified green solutions upon completion.",
        "suggestions": ["Go to Challenges", "Python green tips", "How do I earn badges?"]
    },
    {
        "patterns": [r"\bbadge\b", r"\blevel\b", r"\brank\b", r"\bpoints\b"],
        "reply": "🏆 **Gamification & Badges**:\n- **EcoPoints**: Earn points by reading lessons (+50), passing quizzes (+30), and solving code challenges (+100).\n- **Badges**: Unlock 7 achievements including *First Step*, *Green Apprentice*, *Algorithm Master*, and *Carbon Neutral Pioneer*!\n- **Levels**: Level up from *Eco Novice* all the way to *Green Grandmaster*.",
        "suggestions": ["View Leaderboard", "Check Profile", "Start Lesson 1"]
    }
]

DEFAULT_FALLBACK = (
    "🌱 **EcoBot Assistant**:\n"
    "I'm here to help you master **Green Software Engineering**! You can ask me about:\n"
    "• Writing energy-efficient algorithms in **Python**, **JavaScript**, **Java**, or **C++**\n"
    "• Calculating website carbon footprints with the **Carbon Inspector**\n"
    "• Sustainable cloud architecture & server optimization\n"
    "• Platform guides (Quizzes, Challenges, Badges, and the Green Certificate designed by **Pragya**)\n\n"
    "What topic would you like to explore?"
)

FALLBACK_SUGGESTIONS = [
    "Who created EcoCode Challenge?",
    "How to make Python code greener?",
    "How does the Carbon Inspector work?",
    "How do I earn the Green Certificate?"
]


@assistant_bp.route('/chat', methods=['POST'])
def chat():
    data = request.get_json() or {}
    message = (data.get('message') or '').strip()
    
    if not message:
        return jsonify({
            'reply': "Please ask a question! I'm here to assist with green coding, algorithm efficiency, and EcoCode Challenge.",
            'suggestions': FALLBACK_SUGGESTIONS
        }), 200

    lower_msg = message.lower()

    # Optional: Try Gemini API if GEMINI_API_KEY is configured
    gemini_key = os.getenv('GEMINI_API_KEY')
    if gemini_key:
        try:
            import google.generativeai as genai
            genai.configure(api_key=gemini_key)
            model = genai.GenerativeModel(
                'gemini-1.5-flash',
                system_instruction=(
                    "You are EcoBot, an AI assistant dedicated to Sustainable Software Engineering, "
                    "green algorithms, carbon reduction in tech, and the EcoCode Challenge platform "
                    "created by Pragya. Answer concisely (2-4 paragraphs max), enthusiastically, and provide "
                    "clean code snippets where helpful. Always format with markdown."
                )
            )
            response = model.generate_content(message)
            if response and response.text:
                return jsonify({
                    'reply': response.text,
                    'suggestions': ["Tell me more about green algorithms", "How does code consume electricity?", "How do I earn points?"]
                }), 200
        except Exception:
            # Silently fall back to built-in knowledge base
            pass

    # Pattern Match Knowledge Base
    for entry in KNOWLEDGE_BASE:
        for pat in entry['patterns']:
            if re.search(pat, lower_msg, re.IGNORECASE):
                return jsonify({
                    'reply': entry['reply'],
                    'suggestions': entry['suggestions']
                }), 200

    # General Intelligent Keyword Matcher
    if any(k in lower_msg for k in ['help', 'what can you do', 'menu', 'options']):
        return jsonify({
            'reply': DEFAULT_FALLBACK,
            'suggestions': FALLBACK_SUGGESTIONS
        }), 200

    # Clean default fallback
    return jsonify({
        'reply': f"🌱 **EcoBot Insight on \"{message}\"**:\n\n"
                 f"When tackling software efficiency, prioritize **algorithmic complexity** ($O(n)$ over $O(n^2)$), "
                 f"**memory footprint** (streaming/generators over full array caching), and **network overhead** (minification, Brotli, and cache headers).\n\n"
                 f"Every megabyte avoided and CPU cycle saved directly prevents unnecessary data center power draw and lowers device battery depletion!",
        'suggestions': FALLBACK_SUGGESTIONS
    }), 200
