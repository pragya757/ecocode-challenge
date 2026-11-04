"""Seed the database with initial data."""
import json
from models import db, Lesson, Quiz, Question, Challenge, Badge


def seed_badges():
    badges_data = [
        {'name': 'First Green Step', 'slug': 'first-green-step', 'icon': '🌱', 'description': 'Complete your first lesson on green coding.', 'criteria_type': 'lessons_completed', 'criteria_value': 1},
        {'name': 'Green Learner', 'slug': 'green-learner', 'icon': '📚', 'description': 'Complete 5 lessons.', 'criteria_type': 'lessons_completed', 'criteria_value': 5},
        {'name': 'Code Optimizer', 'slug': 'code-optimizer', 'icon': '⚡', 'description': 'Complete all lessons.', 'criteria_type': 'lessons_completed', 'criteria_value': 8},
        {'name': 'Quiz Master', 'slug': 'quiz-master', 'icon': '🎯', 'description': 'Score above 80% in 3 quizzes.', 'criteria_type': 'quizzes_passed', 'criteria_value': 3},
        {'name': 'Challenge Champion', 'slug': 'challenge-champion', 'icon': '🏆', 'description': 'Complete 5 coding challenges.', 'criteria_type': 'challenges_completed', 'criteria_value': 5},
        {'name': 'Eco Warrior', 'slug': 'eco-warrior', 'icon': '🌍', 'description': 'Earn 500 EcoPoints.', 'criteria_type': 'total_points', 'criteria_value': 500},
        {'name': '7-Day Green Streak', 'slug': 'seven-day-streak', 'icon': '🔥', 'description': 'Maintain a 7-day activity streak.', 'criteria_type': 'streak', 'criteria_value': 7},
    ]
    for b in badges_data:
        if not Badge.query.filter_by(slug=b['slug']).first():
            db.session.add(Badge(**b))
    db.session.commit()


def seed_lessons():
    lessons_data = [
        {
            'title': 'Introduction to Green Computing',
            'slug': 'intro-green-computing',
            'description': 'Understand what green computing means and why it matters for developers.',
            'order': 1,
            'content': json.dumps({
                'explanation': 'Green computing refers to the practice of using computing resources efficiently to reduce environmental impact. It encompasses energy-efficient hardware, software optimization, and sustainable development practices.',
                'key_points': [
                    'Data centers consume ~1-2% of global electricity',
                    'Software efficiency directly impacts energy consumption',
                    'Every optimization counts at scale',
                    'Carbon-aware computing is becoming an industry standard'
                ],
                'inefficient_code': '# Polling every second wastes CPU cycles\nimport time\nwhile True:\n    check_status()\n    time.sleep(1)',
                'optimized_code': '# Use event-driven approach instead\nimport asyncio\nasync def on_status_change(event):\n    await process_event(event)',
                'improvement': 'Event-driven code only executes when needed, reducing CPU cycles and energy usage dramatically compared to constant polling.'
            })
        },
        {
            'title': 'What is Carbon-Aware Coding?',
            'slug': 'carbon-aware-coding',
            'description': 'Learn how to write code that adapts to carbon intensity of the power grid.',
            'order': 2,
            'content': json.dumps({
                'explanation': 'Carbon-aware coding means scheduling computation during times when the electricity grid uses more renewable energy. Carbon intensity varies by region and time of day.',
                'key_points': [
                    'Carbon intensity = grams of CO2 per kWh of electricity',
                    'Renewable energy fluctuates - wind, solar are intermittent',
                    'Deferrable tasks can be scheduled during low-carbon windows',
                    'Tools like Carbon Aware SDK help measure and act on this data'
                ],
                'inefficient_code': '# Always run heavy batch jobs immediately\ndef process_all_data():\n    for record in get_all_records():\n        heavy_computation(record)',
                'optimized_code': '# Schedule heavy jobs when carbon intensity is low\ndef schedule_carbon_aware_job():\n    carbon_intensity = get_current_carbon_intensity()\n    if carbon_intensity < THRESHOLD:\n        process_all_data()\n    else:\n        queue_for_later(process_all_data)',
                'improvement': 'Deferring non-urgent batch processing to low-carbon periods can significantly reduce your software\'s carbon footprint.'
            })
        },
        {
            'title': 'Time Complexity and Energy Efficiency',
            'slug': 'time-complexity-energy',
            'description': 'Explore how algorithmic complexity relates to energy consumption.',
            'order': 3,
            'content': json.dumps({
                'explanation': 'Algorithms with better time complexity generally use fewer CPU cycles, which translates to lower energy consumption. O(n²) vs O(n log n) makes a massive difference at scale.',
                'key_points': [
                    'O(1) < O(log n) < O(n) < O(n log n) < O(n²) in energy cost',
                    'At n=1,000,000: O(n²) uses ~10¹² operations vs O(n log n) ~20×10⁶',
                    'Choose the right data structure for the job',
                    'Profile before optimizing - avoid premature optimization'
                ],
                'inefficient_code': '# O(n²) - Bubble Sort\ndef bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr',
                'optimized_code': '# O(n log n) - Timsort (Python built-in)\ndef efficient_sort(arr):\n    return sorted(arr)  # Uses Timsort - highly optimized',
                'improvement': 'Python\'s built-in sort uses Timsort (O(n log n)) which is dramatically faster than O(n²) bubble sort for large datasets, using far fewer CPU operations.'
            })
        },
        {
            'title': 'Efficient Loops and Algorithms',
            'slug': 'efficient-loops-algorithms',
            'description': 'Learn to write tight, efficient loops that minimize unnecessary work.',
            'order': 4,
            'content': json.dumps({
                'explanation': 'Loops are the most common source of inefficiency. Early exits, avoiding redundant work, and using built-in functions over manual loops can dramatically reduce computation.',
                'key_points': [
                    'Break early when condition is met',
                    'Avoid redundant computations inside loops',
                    'Use list comprehensions (they\'re optimized at the bytecode level)',
                    'Prefer built-in functions: map(), filter(), sum() over manual loops'
                ],
                'inefficient_code': '# Recomputes len(data) every iteration\nresult = []\nfor i in range(len(data)):\n    if data[i] > 0:\n        result.append(data[i] * 2)',
                'optimized_code': '# List comprehension - single pass, optimized bytecode\nresult = [x * 2 for x in data if x > 0]',
                'improvement': 'List comprehensions are compiled to optimized bytecode and avoid repeated attribute lookups for `.append()`. They are more readable and typically faster.'
            })
        },
        {
            'title': 'Memory Optimization',
            'slug': 'memory-optimization',
            'description': 'Reduce memory footprint to lower RAM usage and energy consumption.',
            'order': 5,
            'content': json.dumps({
                'explanation': 'Memory allocation, deallocation, and garbage collection consume energy. Using generators instead of lists, and appropriate data types, reduces memory pressure.',
                'key_points': [
                    'Generators yield one item at a time - O(1) memory vs O(n)',
                    'Use __slots__ in classes to reduce per-instance memory',
                    'numpy arrays are more memory-efficient than Python lists for numbers',
                    'Avoid loading entire files into memory'
                ],
                'inefficient_code': '# Loads entire file into memory\ndef process_file(filepath):\n    with open(filepath) as f:\n        lines = f.readlines()  # All in RAM\n    return [process(line) for line in lines]',
                'optimized_code': '# Streams line by line - O(1) memory\ndef process_file(filepath):\n    with open(filepath) as f:\n        for line in f:  # Generator-based iteration\n            yield process(line)',
                'improvement': 'Streaming with generators processes one line at a time regardless of file size, using constant memory vs linear memory for large files.'
            })
        },
        {
            'title': 'Database Query Optimization',
            'slug': 'database-query-optimization',
            'description': 'Write efficient database queries to reduce server load and energy use.',
            'order': 6,
            'content': json.dumps({
                'explanation': 'Inefficient database queries are one of the biggest energy drains in web applications. The N+1 query problem, missing indexes, and SELECT * are common culprits.',
                'key_points': [
                    'The N+1 problem: fetching related data in a loop',
                    'Use JOIN queries or eager loading instead',
                    'Index columns used in WHERE, JOIN, ORDER BY',
                    'SELECT only needed columns, avoid SELECT *'
                ],
                'inefficient_code': '# N+1 problem: 1 + N queries for N users\nusers = db.query("SELECT * FROM users")\nfor user in users:\n    orders = db.query(f"SELECT * FROM orders WHERE user_id = {user.id}")',
                'optimized_code': '# Single JOIN query: 1 query total\nresults = db.query("""\n    SELECT u.id, u.name, o.order_date, o.total\n    FROM users u\n    LEFT JOIN orders o ON o.user_id = u.id\n""")',
                'improvement': 'A JOIN fetches all data in a single round-trip to the database. The N+1 pattern creates N+1 separate queries, dramatically increasing latency and server energy use.'
            })
        },
        {
            'title': 'Sustainable Software Development',
            'slug': 'sustainable-software-development',
            'description': 'Apply sustainability principles throughout the software development lifecycle.',
            'order': 7,
            'content': json.dumps({
                'explanation': 'Sustainable software development considers the full lifecycle impact of software: development, deployment, operation, and decommissioning.',
                'key_points': [
                    'Choose energy-efficient cloud regions (powered by renewables)',
                    'Right-size infrastructure - avoid over-provisioning',
                    'Implement auto-scaling to match actual demand',
                    'Cache aggressively to avoid redundant computation',
                    'Decommission unused services and resources'
                ],
                'inefficient_code': '# Always fetch fresh data - no caching\ndef get_product_catalog():\n    return db.fetch_all("SELECT * FROM products")',
                'optimized_code': '# Cache for 10 minutes - reduce DB load by ~99%\nfrom functools import lru_cache\nimport time\n\n@lru_cache(maxsize=1)\ndef get_product_catalog():\n    return db.fetch_all("SELECT * FROM products")',
                'improvement': 'Caching popular, infrequently-changing data reduces database queries by orders of magnitude, cutting server energy consumption significantly.'
            })
        },
        {
            'title': 'Best Practices for Green Coding',
            'slug': 'best-practices-green-coding',
            'description': 'A comprehensive summary of green coding best practices for everyday development.',
            'order': 8,
            'content': json.dumps({
                'explanation': 'Green coding is a mindset applied across all development activities. These best practices summarize actionable steps every developer can take.',
                'key_points': [
                    '1. Measure first: profile before optimizing',
                    '2. Choose efficient algorithms and data structures',
                    '3. Minimize network requests - batch, compress, cache',
                    '4. Use lazy loading for resources',
                    '5. Write tests to prevent energy-wasting regressions',
                    '6. Monitor production performance continuously',
                    '7. Prefer statically typed languages for performance-critical paths',
                    '8. Remove dead code and unused dependencies'
                ],
                'inefficient_code': '# Loading entire library for one function\nimport numpy as np  # Huge library\nresult = np.sum([1, 2, 3])  # Could use sum()',
                'optimized_code': '# Use Python built-ins when sufficient\nresult = sum([1, 2, 3])  # No import needed',
                'improvement': 'Only import what you need. Heavy library imports increase startup time and memory usage. Use built-ins when they\'re sufficient for the task.'
            })
        },
    ]
    for l in lessons_data:
        if not Lesson.query.filter_by(slug=l['slug']).first():
            db.session.add(Lesson(**l))
    db.session.commit()


def seed_quizzes():
    quizzes = [
        {
            'title': 'Green Computing Basics',
            'category': 'Green Computing Basics',
            'description': 'Test your knowledge of fundamental green computing concepts.',
            'questions': [
                {'text': 'What percentage of global electricity do data centers approximately consume?', 'option_a': '0.1-0.5%', 'option_b': '1-2%', 'option_c': '10-15%', 'option_d': '25-30%', 'correct_option': 'b', 'explanation': 'Data centers consume approximately 1-2% of global electricity, a significant amount that is growing with digital adoption.'},
                {'text': 'What does "carbon intensity" of electricity measure?', 'option_a': 'The price of electricity per kWh', 'option_b': 'The number of power plants in a region', 'option_c': 'Grams of CO2 emitted per kWh of electricity produced', 'option_d': 'The voltage of the electrical grid', 'correct_option': 'c', 'explanation': 'Carbon intensity measures how much CO2 is emitted to produce one kilowatt-hour of electricity. Lower is greener.'},
                {'text': 'Which approach best represents "carbon-aware computing"?', 'option_a': 'Using solar panels to power your laptop', 'option_b': 'Scheduling deferrable tasks during low-carbon grid periods', 'option_c': 'Writing code with fewer comments', 'option_d': 'Using dark mode to save battery', 'correct_option': 'b', 'explanation': 'Carbon-aware computing schedules non-urgent workloads when renewable energy is abundant on the grid, reducing carbon emissions.'},
                {'text': 'What is the primary goal of green software engineering?', 'option_a': 'Make software look eco-friendly', 'option_b': 'Reduce the environmental footprint of software systems', 'option_c': 'Use only open-source tools', 'option_d': 'Eliminate cloud computing', 'correct_option': 'b', 'explanation': 'Green software engineering aims to reduce the environmental impact of software through energy efficiency, carbon awareness, and hardware efficiency.'},
                {'text': 'Which factor does NOT directly affect software energy consumption?', 'option_a': 'Algorithm complexity', 'option_b': 'Programming language', 'option_c': 'Variable naming conventions', 'option_d': 'Number of database queries', 'correct_option': 'c', 'explanation': 'Variable naming has no effect on runtime energy consumption. Algorithm complexity, language efficiency, and query count all directly impact energy use.'},
                {'text': 'What does SCI stand for in the Green Software Foundation?', 'option_a': 'Software Carbon Intensity', 'option_b': 'System Computation Index', 'option_c': 'Sustainable Code Interface', 'option_d': 'Server Carbon Impact', 'correct_option': 'a', 'explanation': 'SCI (Software Carbon Intensity) is a specification for calculating the carbon intensity of software applications.'},
                {'text': 'Which cloud provider action most reduces your carbon footprint?', 'option_a': 'Using the cheapest server', 'option_b': 'Choosing regions powered by renewable energy', 'option_c': 'Using Windows servers instead of Linux', 'option_d': 'Increasing server memory', 'correct_option': 'b', 'explanation': 'Cloud regions vary significantly in their energy mix. Choosing regions powered by renewables directly reduces your software\'s carbon emissions.'},
                {'text': 'What is "embodied carbon" in computing?', 'option_a': 'CO2 emitted while running software', 'option_b': 'Carbon from air conditioning in data centers', 'option_c': 'CO2 emitted during hardware manufacturing and disposal', 'option_d': 'Carbon stored in batteries', 'correct_option': 'c', 'explanation': 'Embodied carbon refers to CO2 emissions from manufacturing, shipping, and disposing of hardware - often as significant as operational emissions.'},
            ]
        },
        {
            'title': 'Energy-Efficient Programming',
            'category': 'Energy-Efficient Programming',
            'description': 'Test your knowledge of writing energy-efficient code.',
            'questions': [
                {'text': 'Which sorting algorithm is generally most energy-efficient for large datasets?', 'option_a': 'Bubble Sort - O(n²)', 'option_b': 'Selection Sort - O(n²)', 'option_c': 'Merge Sort / Timsort - O(n log n)', 'option_d': 'Insertion Sort - O(n²)', 'correct_option': 'c', 'explanation': 'O(n log n) algorithms like Merge Sort and Timsort require exponentially fewer operations than O(n²) algorithms for large n, consuming less energy.'},
                {'text': 'What is the N+1 query problem?', 'option_a': 'Having more than N database tables', 'option_b': 'Executing N individual queries inside a loop instead of one JOIN', 'option_c': 'Adding N+1 indexes to a table', 'option_d': 'Using N+1 database connections', 'correct_option': 'b', 'explanation': 'The N+1 problem occurs when you fetch a list of N items then query the database N more times in a loop. Using JOINs or eager loading solves this.'},
                {'text': 'Why are Python generators more memory-efficient than lists?', 'option_a': 'They compress data', 'option_b': 'They use less CPU', 'option_c': 'They yield items one at a time, using O(1) memory', 'option_d': 'They run on the GPU', 'correct_option': 'c', 'explanation': 'Generators produce values lazily on demand, using constant memory regardless of dataset size. Lists store all values in memory simultaneously.'},
                {'text': 'What does "lazy loading" mean in software?', 'option_a': 'Loading everything at startup', 'option_b': 'Deferring resource loading until it is actually needed', 'option_c': 'Using cached results permanently', 'option_d': 'Skipping error handling', 'correct_option': 'b', 'explanation': 'Lazy loading defers initialization/loading of resources until first use, avoiding unnecessary work and memory consumption for unused components.'},
                {'text': 'Which is more energy-efficient for checking membership in a large collection?', 'option_a': 'list.index()', 'option_b': 'Linear search with a for loop', 'option_c': 'Using a set (hash table lookup)', 'option_d': 'Binary search on a sorted list', 'correct_option': 'c', 'explanation': 'Set membership testing is O(1) average case using hash tables. Linear list search is O(n), and binary search is O(log n). For repeated lookups, sets win.'},
                {'text': 'What is tail call optimization?', 'option_a': 'Optimizing the last function in a file', 'option_b': 'Reusing the current stack frame for recursive tail calls', 'option_c': 'Removing trailing whitespace from code', 'option_d': 'Caching function return values', 'correct_option': 'b', 'explanation': 'Tail call optimization reuses the current stack frame when a function\'s last action is a recursive call, preventing stack overflow and reducing memory usage.'},
                {'text': 'Which approach reduces network energy consumption most?', 'option_a': 'Sending many small requests', 'option_b': 'Using HTTP/1.1 for all requests', 'option_c': 'Batching requests and compressing payloads', 'option_d': 'Polling every second for updates', 'correct_option': 'c', 'explanation': 'Batching reduces the number of round trips; compression reduces data transmitted. Both directly reduce network energy consumption.'},
                {'text': 'Why should you avoid SELECT * in SQL queries?', 'option_a': 'It is not valid SQL syntax', 'option_b': 'It transfers unnecessary columns, wasting bandwidth and memory', 'option_c': 'It prevents index usage', 'option_d': 'It locks the entire table', 'correct_option': 'b', 'explanation': 'SELECT * retrieves all columns even when you only need a few. This wastes database I/O, network bandwidth, and application memory unnecessarily.'},
            ]
        },
        {
            'title': 'Algorithm Optimization',
            'category': 'Algorithm Optimization',
            'description': 'Deep dive into algorithmic thinking for sustainable code.',
            'questions': [
                {'text': 'What is memoization?', 'option_a': 'Writing code comments for memory', 'option_b': 'Caching expensive function results to avoid recomputation', 'option_c': 'Storing code in ROM', 'option_d': 'A type of sorting algorithm', 'correct_option': 'b', 'explanation': 'Memoization caches the results of expensive function calls and returns cached results when the same inputs occur again, avoiding redundant computation.'},
                {'text': 'What time complexity does binary search achieve?', 'option_a': 'O(n)', 'option_b': 'O(n²)', 'option_c': 'O(log n)', 'option_d': 'O(1)', 'correct_option': 'c', 'explanation': 'Binary search halves the search space each iteration, achieving O(log n) time complexity - much more efficient than linear search O(n) for sorted data.'},
                {'text': 'Which data structure gives O(1) average insertion and lookup?', 'option_a': 'Array/List', 'option_b': 'Hash Table (dict/set)', 'option_c': 'Binary Search Tree', 'option_d': 'Linked List', 'correct_option': 'b', 'explanation': 'Hash tables use a hash function to map keys to indices, achieving O(1) average case for insert, delete, and lookup operations.'},
                {'text': 'What is dynamic programming primarily used for?', 'option_a': 'Generating random numbers', 'option_b': 'Network programming', 'option_c': 'Breaking complex problems into overlapping subproblems to avoid recomputation', 'option_d': 'Managing database connections', 'correct_option': 'c', 'explanation': 'Dynamic programming solves complex problems by breaking them into overlapping subproblems and storing results, turning exponential algorithms into polynomial ones.'},
                {'text': 'Why is a list comprehension often faster than an equivalent for loop in Python?', 'option_a': 'List comprehensions use multiple CPUs', 'option_b': 'They compile to optimized bytecode that avoids attribute lookups for append()', 'option_c': 'They automatically use caching', 'option_d': 'They skip error handling', 'correct_option': 'b', 'explanation': 'List comprehensions are compiled to specialized bytecode (LIST_APPEND) that avoids the overhead of looking up and calling list.append() on every iteration.'},
                {'text': 'What is the space complexity of an in-place sorting algorithm?', 'option_a': 'O(n)', 'option_b': 'O(n log n)', 'option_c': 'O(n²)', 'option_d': 'O(1)', 'correct_option': 'd', 'explanation': 'In-place algorithms sort data using only a constant amount of extra memory (O(1) space), regardless of input size.'},
                {'text': 'Which technique avoids recomputing a value multiple times in a loop?', 'option_a': 'Loop unrolling', 'option_b': 'Hoisting the computation outside the loop', 'option_c': 'Using a larger loop step', 'option_d': 'Adding more conditions', 'correct_option': 'b', 'explanation': 'Loop hoisting (or invariant code motion) moves computations that don\'t change inside the loop to outside it, computing the value once instead of N times.'},
                {'text': 'What is the advantage of using a deque over a list for queue operations?', 'option_a': 'Deque uses less memory always', 'option_b': 'Deque is thread-safe', 'option_c': 'Deque provides O(1) append and popleft vs O(n) for list', 'option_d': 'Deque supports sorting', 'correct_option': 'c', 'explanation': 'collections.deque provides O(1) operations on both ends. list.pop(0) is O(n) because it must shift all remaining elements.'},
            ]
        },
        {
            'title': 'Memory Management',
            'category': 'Memory Management',
            'description': 'Understand memory efficiency for greener software.',
            'questions': [
                {'text': 'What does garbage collection do?', 'option_a': 'Removes comments from code', 'option_b': 'Automatically reclaims memory occupied by unreachable objects', 'option_c': 'Compresses disk files', 'option_d': 'Clears the screen', 'correct_option': 'b', 'explanation': 'Garbage collection automatically identifies and frees memory occupied by objects that are no longer reachable, preventing memory leaks.'},
                {'text': 'What is a memory leak?', 'option_a': 'RAM physically leaking electricity', 'option_b': 'Memory that is allocated but never freed, growing over time', 'option_c': 'Data corruption in memory', 'option_d': 'Too many variables declared', 'correct_option': 'b', 'explanation': 'A memory leak occurs when a program allocates memory but loses all references to it without freeing it, causing memory usage to grow indefinitely.'},
                {'text': 'Which Python feature reduces per-object memory overhead in classes?', 'option_a': 'decorators', 'option_b': 'metaclasses', 'option_c': '__slots__', 'option_d': 'class methods', 'correct_option': 'c', 'explanation': '__slots__ prevents Python from creating a __dict__ for each instance, significantly reducing memory usage when creating many instances of a class.'},
                {'text': 'What is object pooling?', 'option_a': 'Storing objects in a database', 'option_b': 'Reusing pre-allocated objects instead of creating new ones', 'option_c': 'Grouping related classes', 'option_d': 'Multi-threaded object access', 'correct_option': 'b', 'explanation': 'Object pooling reuses a set of initialized objects rather than creating and destroying them repeatedly, reducing allocation overhead and garbage collection pressure.'},
                {'text': 'Why are numpy arrays more memory-efficient than Python lists for numbers?', 'option_a': 'numpy uses compression', 'option_b': 'numpy stores typed values contiguously in memory without Python object overhead', 'option_c': 'numpy uses GPU memory', 'option_d': 'numpy limits array size', 'correct_option': 'b', 'explanation': 'numpy arrays store raw typed values (e.g., float64) in a contiguous block. Python lists store pointers to Python objects, each with 28+ bytes of overhead per number.'},
                {'text': 'What is copy-on-write optimization?', 'option_a': 'Automatically backing up files', 'option_b': 'Sharing memory until modification, then copying only on write', 'option_c': 'Writing logs during copy operations', 'option_d': 'Encrypting copied data', 'correct_option': 'b', 'explanation': 'Copy-on-write shares the same memory between copies until one is modified. This avoids unnecessary duplication and reduces memory usage for read-heavy operations.'},
                {'text': 'What does reference counting do in memory management?', 'option_a': 'Counts how many lines reference a variable by name', 'option_b': 'Tracks how many pointers point to an object to know when to free it', 'option_c': 'Counts memory pages', 'option_d': 'Measures RAM clock speed', 'correct_option': 'b', 'explanation': 'Reference counting tracks how many references point to each object. When the count reaches zero, the memory is immediately freed - this is how CPython manages most memory.'},
                {'text': 'What is memory fragmentation?', 'option_a': 'Splitting code into modules', 'option_b': 'Free memory scattered in small non-contiguous blocks, making large allocations fail', 'option_c': 'Corrupted RAM cells', 'option_d': 'Too many function calls', 'correct_option': 'b', 'explanation': 'Memory fragmentation occurs when free memory is broken into small scattered chunks. Even with enough total free memory, large allocations may fail due to lack of contiguous space.'},
            ]
        },
        {
            'title': 'Sustainable Software Engineering',
            'category': 'Sustainable Software Engineering',
            'description': 'Holistic practices for sustainable software systems.',
            'questions': [
                {'text': 'What is the "right-sizing" principle in cloud computing?', 'option_a': 'Using the largest available instance', 'option_b': 'Matching compute resources to actual workload requirements', 'option_c': 'Keeping all servers at 100% CPU', 'option_d': 'Using only on-premises hardware', 'correct_option': 'b', 'explanation': 'Right-sizing means provisioning exactly the compute resources needed. Over-provisioned servers waste energy running at low utilization.'},
                {'text': 'What is auto-scaling in cloud infrastructure?', 'option_a': 'Automatically increasing storage', 'option_b': 'Dynamically adjusting server count based on demand', 'option_c': 'Scaling images automatically', 'option_d': 'Automatic code refactoring', 'correct_option': 'b', 'explanation': 'Auto-scaling automatically adds servers during high demand and removes them during low demand, ensuring energy is only consumed when needed.'},
                {'text': 'Which CI/CD practice reduces wasted computation?', 'option_a': 'Running all tests on every commit regardless of changes', 'option_b': 'Selective test execution based on changed code paths', 'option_c': 'Disabling tests to save time', 'option_d': 'Building all branches simultaneously', 'correct_option': 'b', 'explanation': 'Selective/targeted testing runs only tests relevant to changed code, reducing CI/CD pipeline compute time and energy by avoiding unnecessary test execution.'},
                {'text': 'What does "technical debt" have to do with sustainability?', 'option_a': 'Nothing - they are unrelated', 'option_b': 'Technical debt often includes inefficient code that wastes energy at scale', 'option_c': 'Technical debt is a financial concept only', 'option_d': 'Technical debt makes code greener', 'correct_option': 'b', 'explanation': 'Technical debt often manifests as inefficient algorithms, unnecessary dependencies, and poor architecture choices that waste compute resources and energy in production.'},
                {'text': 'What is the environmental benefit of serverless computing?', 'option_a': 'Uses no electricity', 'option_b': 'Resources are provisioned only while code runs, reducing idle energy waste', 'option_c': 'Runs on solar power automatically', 'option_d': 'Eliminates the need for algorithms', 'correct_option': 'b', 'explanation': 'Serverless functions only consume compute resources while executing. Traditional servers waste energy sitting idle. Serverless can dramatically reduce idle energy consumption.'},
                {'text': 'What is "green software" according to the Green Software Foundation?', 'option_a': 'Software with a green color scheme', 'option_b': 'Software that is carbon-efficient, energy-efficient, and hardware-efficient', 'option_c': 'Open-source software only', 'option_d': 'Software running on Linux', 'correct_option': 'b', 'explanation': 'The Green Software Foundation defines green software as software that is carbon-efficient, energy-efficient, and hardware-efficient - minimizing its environmental impact.'},
                {'text': 'Which measurement is most useful for quantifying software sustainability?', 'option_a': 'Lines of code written', 'option_b': 'Number of developers on the team', 'option_c': 'Carbon emissions per user request or per business unit', 'option_d': 'Application startup time', 'correct_option': 'c', 'explanation': 'Measuring carbon emissions per functional unit (request, transaction, user) gives a normalized, meaningful metric for software sustainability.'},
                {'text': 'What is the "shift left" approach to green software?', 'option_a': 'Moving servers to the left rack', 'option_b': 'Addressing sustainability early in development rather than as an afterthought', 'option_c': 'Using left-aligned code formatting', 'option_d': 'Running code on the left CPU core', 'correct_option': 'b', 'explanation': 'Shift left means addressing concerns (including sustainability) earlier in the development lifecycle, where changes are cheapest and most impactful.'},
            ]
        },
    ]

    for quiz_data in quizzes:
        if not Quiz.query.filter_by(title=quiz_data['title']).first():
            q = Quiz(
                title=quiz_data['title'],
                category=quiz_data['category'],
                description=quiz_data['description']
            )
            db.session.add(q)
            db.session.flush()
            for i, qd in enumerate(quiz_data['questions']):
                question = Question(
                    quiz_id=q.id,
                    text=qd['text'],
                    option_a=qd['option_a'],
                    option_b=qd['option_b'],
                    option_c=qd['option_c'],
                    option_d=qd['option_d'],
                    correct_option=qd['correct_option'],
                    explanation=qd['explanation'],
                    order=i
                )
                db.session.add(question)
    db.session.commit()


def seed_challenges():
    challenges_data = [
        {
            'title': 'Green Fibonacci',
            'slug': 'green-fibonacci',
            'description': 'Optimize a recursive Fibonacci implementation using memoization.',
            'problem_statement': 'The naive recursive Fibonacci function recomputes the same values exponentially. Implement an efficient version using memoization or dynamic programming.\n\nWrite a function fibonacci(n) that returns the nth Fibonacci number efficiently.',
            'difficulty': 'Easy',
            'language': 'Python',
            'input_example': 'n = 10',
            'output_example': '55',
            'constraints': '0 <= n <= 100\nMust use O(n) or better time complexity.',
            'hints': 'Use @functools.lru_cache or build a bottom-up DP table.',
            'sample_solution': 'from functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)',
            'points': 20,
        },
        {
            'title': 'Efficient List Deduplication',
            'slug': 'efficient-list-deduplication',
            'description': 'Remove duplicates from a list using the most energy-efficient approach.',
            'problem_statement': 'Given a list of integers, remove all duplicate values and return the unique values. Your solution should use O(n) time complexity.\n\nFunction: deduplicate(numbers) -> List[int]',
            'difficulty': 'Easy',
            'language': 'Python',
            'input_example': 'numbers = [1, 2, 3, 2, 4, 1, 5]',
            'output_example': '[1, 2, 3, 4, 5]',
            'constraints': 'O(n) time complexity required.\nOrder need not be preserved.',
            'hints': 'Sets provide O(1) lookup and automatically handle duplicates.',
            'sample_solution': 'def deduplicate(numbers):\n    return list(set(numbers))',
            'points': 20,
        },
        {
            'title': 'Carbon-Aware Task Scheduler',
            'slug': 'carbon-aware-scheduler',
            'description': 'Implement a simple carbon-aware job scheduler.',
            'problem_statement': 'You have a list of tasks with their durations and urgency levels. Carbon intensity readings are given for each hour of the day. Schedule non-urgent tasks during the lowest carbon intensity hours.\n\nFunction: schedule_tasks(tasks, carbon_forecast) where tasks is a list of dicts with keys: name, duration_hours, urgent. carbon_forecast is a list of 24 carbon intensity values (one per hour).\n\nReturn a list of (task_name, start_hour) tuples for non-urgent tasks scheduled in lowest-carbon windows.',
            'difficulty': 'Medium',
            'language': 'Python',
            'input_example': 'tasks = [{"name":"batch_job","duration_hours":2,"urgent":False}]\ncarbon_forecast = [100,90,80,70,60,50,55,65,80,100,...]',
            'output_example': '[("batch_job", 5)]',
            'constraints': 'Tasks cannot overlap.\nOnly schedule non-urgent tasks (urgent=False).\nMinimize total carbon during task execution.',
            'hints': 'Find the window of consecutive hours with minimum average carbon intensity for each task duration.',
            'sample_solution': 'def schedule_tasks(tasks, carbon_forecast):\n    result = []\n    scheduled_hours = set()\n    \n    non_urgent = [t for t in tasks if not t["urgent"]]\n    \n    for task in non_urgent:\n        dur = task["duration_hours"]\n        best_start = 0\n        best_carbon = float("inf")\n        \n        for start in range(24 - dur + 1):\n            if any(h in scheduled_hours for h in range(start, start+dur)):\n                continue\n            avg_carbon = sum(carbon_forecast[start:start+dur]) / dur\n            if avg_carbon < best_carbon:\n                best_carbon = avg_carbon\n                best_start = start\n        \n        for h in range(best_start, best_start + dur):\n            scheduled_hours.add(h)\n        result.append((task["name"], best_start))\n    \n    return result',
            'points': 40,
        },
        {
            'title': 'Memory-Efficient Word Counter',
            'slug': 'memory-efficient-word-counter',
            'description': 'Count word frequencies in a large text file using a generator.',
            'problem_statement': 'Count the frequency of each word in a large text, using a streaming/generator approach to avoid loading the entire text into memory at once.\n\nFunction: count_words(text_lines) where text_lines is a generator/iterable of strings (lines). Return a dict of word -> count.',
            'difficulty': 'Easy',
            'language': 'Python',
            'input_example': 'text_lines = iter(["hello world", "hello python"])',
            'output_example': '{"hello": 2, "world": 1, "python": 1}',
            'constraints': 'Must work as a generator (do not call list() on input).\nCase-insensitive counting.',
            'hints': 'Use collections.Counter and iterate lazily over lines.',
            'sample_solution': 'from collections import Counter\n\ndef count_words(text_lines):\n    counter = Counter()\n    for line in text_lines:  # Lazy iteration\n        words = line.lower().split()\n        counter.update(words)\n    return dict(counter)',
            'points': 25,
        },
        {
            'title': 'O(n log n) Sort Verifier',
            'slug': 'sort-complexity-verifier',
            'description': 'Implement merge sort and verify it beats bubble sort on a large input.',
            'problem_statement': 'Implement merge_sort(arr) that sorts a list in O(n log n) time. Your implementation should be a correct, recursive merge sort.\n\nThe function should return a new sorted list without modifying the original.',
            'difficulty': 'Medium',
            'language': 'Python',
            'input_example': 'arr = [64, 34, 25, 12, 22, 11, 90]',
            'output_example': '[11, 12, 22, 25, 34, 64, 90]',
            'constraints': 'Must be recursive merge sort.\nO(n log n) time, O(n) space.\nDo not use Python built-in sort.',
            'hints': 'Recursively split the array in half, sort each half, then merge the two sorted halves.',
            'sample_solution': 'def merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    return merge(left, right)\n\ndef merge(left, right):\n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i])\n            i += 1\n        else:\n            result.append(right[j])\n            j += 1\n    result.extend(left[i:])\n    result.extend(right[j:])\n    return result',
            'points': 35,
        },
        {
            'title': 'Database Query Optimizer',
            'slug': 'database-query-optimizer',
            'description': 'Identify the most efficient query approach given a schema and requirements.',
            'problem_statement': 'Given a list of users and their orders as Python dicts, find all users who have placed more than 3 orders and their total spend.\n\nImplement: get_high_value_customers(users, orders) where users is a list of {id, name} dicts and orders is a list of {user_id, amount} dicts.\n\nReturn a list of {name, order_count, total_spend} dicts, sorted by total_spend descending.',
            'difficulty': 'Medium',
            'language': 'Python',
            'input_example': 'users=[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}]\norders=[{"user_id":1,"amount":100},{"user_id":1,"amount":200},{"user_id":1,"amount":150},{"user_id":1,"amount":75}]',
            'output_example': '[{"name":"Alice","order_count":4,"total_spend":525}]',
            'constraints': 'O(n) or O(n log n) solution required.\nUse dict/defaultdict for aggregation, not nested loops.',
            'hints': 'Use collections.defaultdict to aggregate orders per user in one pass.',
            'sample_solution': 'from collections import defaultdict\n\ndef get_high_value_customers(users, orders):\n    user_map = {u["id"]: u["name"] for u in users}\n    aggregated = defaultdict(lambda: {"count": 0, "total": 0})\n    \n    for order in orders:\n        uid = order["user_id"]\n        aggregated[uid]["count"] += 1\n        aggregated[uid]["total"] += order["amount"]\n    \n    result = []\n    for uid, data in aggregated.items():\n        if data["count"] > 3:\n            result.append({\n                "name": user_map[uid],\n                "order_count": data["count"],\n                "total_spend": data["total"]\n            })\n    \n    return sorted(result, key=lambda x: x["total_spend"], reverse=True)',
            'points': 40,
        },
        {
            'title': 'Lazy Range Generator',
            'slug': 'lazy-range-generator',
            'description': 'Implement a memory-efficient range generator for very large ranges.',
            'problem_statement': 'Implement a custom generator function infinite_multiples(n) that yields all positive multiples of n, starting from n, indefinitely.\n\nThen write take(generator, count) that takes the first count items from any generator.',
            'difficulty': 'Easy',
            'language': 'Python',
            'input_example': 'list(take(infinite_multiples(3), 5))',
            'output_example': '[3, 6, 9, 12, 15]',
            'constraints': 'Must be a generator (use yield).\nMust not create a list of values in memory.',
            'hints': 'Use `yield` and an infinite while loop. Use itertools.islice or a counter for take().',
            'sample_solution': 'def infinite_multiples(n):\n    value = n\n    while True:\n        yield value\n        value += n\n\ndef take(generator, count):\n    result = []\n    for _, item in zip(range(count), generator):\n        result.append(item)\n    return result',
            'points': 20,
        },
        {
            'title': 'Cache Decorator',
            'slug': 'cache-decorator',
            'description': 'Implement a simple memoization decorator for pure functions.',
            'problem_statement': 'Implement a @memoize decorator that caches the results of a function based on its arguments. The decorator should work for functions with any number of positional arguments.\n\nThen demonstrate its effect by applying it to an expensive_computation(n) function.',
            'difficulty': 'Medium',
            'language': 'Python',
            'input_example': '@memoize\ndef expensive(n):\n    return sum(range(n))\n\nexpensive(1000)  # Computed\nexpensive(1000)  # From cache',
            'output_example': '499500 (returned instantly on second call)',
            'constraints': 'Must work for any hashable arguments.\nUse a dict for the cache.\nDo not use functools.lru_cache.',
            'hints': 'Use *args as the cache key. Store results in a dict inside the closure.',
            'sample_solution': 'def memoize(func):\n    cache = {}\n    def wrapper(*args):\n        if args not in cache:\n            cache[args] = func(*args)\n        return cache[args]\n    wrapper.__name__ = func.__name__\n    return wrapper\n\n@memoize\ndef expensive_computation(n):\n    return sum(range(n))',
            'points': 30,
        },
        {
            'title': 'Green API Rate Limiter',
            'slug': 'green-api-rate-limiter',
            'description': 'Implement a token bucket rate limiter to prevent API abuse and reduce energy waste.',
            'problem_statement': 'Implement a TokenBucket class that limits API requests. It should have:\n- capacity: maximum tokens\n- refill_rate: tokens added per second\n- consume(tokens=1): returns True if request allowed, False if rate limited\n\nThis prevents clients from hammering APIs unnecessarily.',
            'difficulty': 'Hard',
            'language': 'Python',
            'input_example': 'bucket = TokenBucket(capacity=10, refill_rate=2)\nbucket.consume()  # True\n# After using all 10 tokens:\nbucket.consume()  # False until refilled',
            'output_example': 'True / False based on available tokens',
            'constraints': 'Must handle time-based refilling accurately.\nTokens should not exceed capacity.\nUse time.time() for timing.',
            'hints': 'Store the last refill timestamp. On each consume(), calculate elapsed time and add tokens accordingly.',
            'sample_solution': 'import time\n\nclass TokenBucket:\n    def __init__(self, capacity, refill_rate):\n        self.capacity = capacity\n        self.refill_rate = refill_rate\n        self.tokens = capacity\n        self.last_refill = time.time()\n    \n    def _refill(self):\n        now = time.time()\n        elapsed = now - self.last_refill\n        new_tokens = elapsed * self.refill_rate\n        self.tokens = min(self.capacity, self.tokens + new_tokens)\n        self.last_refill = now\n    \n    def consume(self, tokens=1):\n        self._refill()\n        if self.tokens >= tokens:\n            self.tokens -= tokens\n            return True\n        return False',
            'points': 50,
        },
        {
            'title': 'Efficient String Builder',
            'slug': 'efficient-string-builder',
            'description': 'Build strings efficiently without repeated concatenation.',
            'problem_statement': 'String concatenation with + in a loop creates a new string object each iteration, wasting memory. Implement build_report(items) that concatenates a list of strings into a formatted report efficiently.\n\nEach item should appear on its own line with a number prefix: "1. item_one\\n2. item_two"',
            'difficulty': 'Easy',
            'language': 'Python',
            'input_example': 'items = ["Write green code", "Reduce energy waste", "Use generators"]',
            'output_example': '"1. Write green code\\n2. Reduce energy waste\\n3. Use generators"',
            'constraints': 'Must NOT use += for string concatenation in a loop.\nMust use join() or similar efficient method.',
            'hints': 'Use str.join() on a list of formatted strings. It allocates memory once.',
            'sample_solution': 'def build_report(items):\n    lines = [f"{i+1}. {item}" for i, item in enumerate(items)]\n    return "\\n".join(lines)',
            'points': 20,
        },
        {
            'title': 'Sliding Window Maximum',
            'slug': 'sliding-window-maximum',
            'description': 'Find the maximum in each sliding window efficiently.',
            'problem_statement': 'Given an array and window size k, find the maximum value in each sliding window of size k. A naive O(n*k) approach recalculates the max each step. Implement an O(n) solution.\n\nFunction: sliding_window_max(nums, k) -> List[int]',
            'difficulty': 'Hard',
            'language': 'Python',
            'input_example': 'nums = [1,3,-1,-3,5,3,6,7], k = 3',
            'output_example': '[3, 3, 5, 5, 6, 7]',
            'constraints': 'O(n) time complexity.\nUse a deque for the monotonic queue approach.',
            'hints': 'Use a deque to store indices of potential maximums. Maintain it in decreasing order of values.',
            'sample_solution': 'from collections import deque\n\ndef sliding_window_max(nums, k):\n    dq = deque()  # stores indices\n    result = []\n    \n    for i, num in enumerate(nums):\n        # Remove elements outside window\n        while dq and dq[0] < i - k + 1:\n            dq.popleft()\n        # Remove smaller elements (they can never be max)\n        while dq and nums[dq[-1]] < num:\n            dq.pop()\n        dq.append(i)\n        # Window is full\n        if i >= k - 1:\n            result.append(nums[dq[0]])\n    \n    return result',
            'points': 60,
        },
        {
            'title': 'Green Config Parser',
            'slug': 'green-config-parser',
            'description': 'Parse configuration files with minimal memory usage.',
            'problem_statement': 'Implement parse_config(lines) that parses simple key=value configuration lines from an iterable (generator) of strings. Skip comment lines starting with # and blank lines.\n\nReturn a dict of string key-value pairs.',
            'difficulty': 'Easy',
            'language': 'Python',
            'input_example': 'lines = ["# Comment", "host=localhost", "port=5432", "", "db=ecocode"]',
            'output_example': '{"host": "localhost", "port": "5432", "db": "ecocode"}',
            'constraints': 'Process lines lazily (do not convert to list).\nStrip whitespace from keys and values.',
            'hints': 'Iterate directly over lines. Use str.startswith() and str.split("=", 1).',
            'sample_solution': 'def parse_config(lines):\n    config = {}\n    for line in lines:\n        line = line.strip()\n        if not line or line.startswith("#"):\n            continue\n        if "=" in line:\n            key, value = line.split("=", 1)\n            config[key.strip()] = value.strip()\n    return config',
            'points': 20,
        },
        {
            'title': 'Batch Processing Pipeline',
            'slug': 'batch-processing-pipeline',
            'description': 'Process data in batches to reduce memory usage for large datasets.',
            'problem_statement': 'Implement process_in_batches(data_generator, batch_size, process_fn) that processes items from a generator in batches of batch_size.\n\nFor each batch, call process_fn(batch) and collect results. Return a flat list of all processed results.',
            'difficulty': 'Medium',
            'language': 'Python',
            'input_example': 'data = iter(range(100))\nresult = process_in_batches(data, 10, sum)\n# Processes [0..9], [10..19], ...',
            'output_example': '[45, 145, 245, 345, 445, 545, 645, 745, 845, 945]',
            'constraints': 'Never accumulate all data in memory at once.\nHandle cases where total items is not divisible by batch_size.',
            'hints': 'Use itertools.islice to take batch_size items at a time from the generator.',
            'sample_solution': 'from itertools import islice\n\ndef process_in_batches(data_generator, batch_size, process_fn):\n    results = []\n    while True:\n        batch = list(islice(data_generator, batch_size))\n        if not batch:\n            break\n        results.append(process_fn(batch))\n    return results',
            'points': 35,
        },
        {
            'title': 'Energy-Aware Priority Queue',
            'slug': 'energy-aware-priority-queue',
            'description': 'Implement a priority queue for scheduling tasks by energy cost.',
            'problem_statement': 'Implement an EnergyScheduler class using a min-heap to always process the least energy-intensive task next.\n\nMethods:\n- add_task(name, energy_cost): Add a task\n- next_task(): Remove and return the task with lowest energy cost\n- peek(): View the next task without removing it',
            'difficulty': 'Medium',
            'language': 'Python',
            'input_example': 'scheduler = EnergyScheduler()\nscheduler.add_task("compress", 10)\nscheduler.add_task("train_model", 500)\nscheduler.add_task("send_email", 2)\nscheduler.next_task()  # ("send_email", 2)',
            'output_example': '("send_email", 2)',
            'constraints': 'Must use heapq (min-heap).\nO(log n) insertion and extraction.',
            'hints': 'Use heapq.heappush and heapq.heappop. Store tuples of (energy_cost, name).',
            'sample_solution': 'import heapq\n\nclass EnergyScheduler:\n    def __init__(self):\n        self._heap = []\n    \n    def add_task(self, name, energy_cost):\n        heapq.heappush(self._heap, (energy_cost, name))\n    \n    def next_task(self):\n        if not self._heap:\n            return None\n        cost, name = heapq.heappop(self._heap)\n        return (name, cost)\n    \n    def peek(self):\n        if not self._heap:\n            return None\n        cost, name = self._heap[0]\n        return (name, cost)',
            'points': 40,
        },
        {
            'title': 'Efficient CSV Streamer',
            'slug': 'efficient-csv-streamer',
            'description': 'Stream and process a large CSV without loading it into memory.',
            'problem_statement': 'Implement stream_csv_stats(csv_lines) that computes basic statistics (count, sum, average) for a numeric column in a CSV file, processing line by line.\n\nThe CSV has columns: id, name, value. Return {"count": N, "sum": S, "average": A}.',
            'difficulty': 'Medium',
            'language': 'Python',
            'input_example': 'lines = iter(["id,name,value", "1,alpha,10", "2,beta,20", "3,gamma,30"])',
            'output_example': '{"count": 3, "sum": 60, "average": 20.0}',
            'constraints': 'Process lazily - no list() on the input.\nSkip the header row.',
            'hints': 'Skip the first line (header). Split each line by comma and extract the value column.',
            'sample_solution': 'def stream_csv_stats(csv_lines):\n    count = 0\n    total = 0.0\n    next(csv_lines)  # skip header\n    for line in csv_lines:\n        parts = line.strip().split(",")\n        if len(parts) >= 3:\n            try:\n                value = float(parts[2])\n                total += value\n                count += 1\n            except ValueError:\n                pass\n    avg = total / count if count > 0 else 0\n    return {"count": count, "sum": total, "average": avg}',
            'points': 35,
        },
    ]

    # Assign daily challenges based on date index
    from datetime import date
    base_date = date(2024, 1, 1)
    for i, ch_data in enumerate(challenges_data):
        if not Challenge.query.filter_by(slug=ch_data['slug']).first():
            daily_date = base_date.replace(day=base_date.day + i) if i < 28 else None
            ch = Challenge(
                title=ch_data['title'],
                slug=ch_data['slug'],
                description=ch_data['description'],
                problem_statement=ch_data['problem_statement'],
                difficulty=ch_data['difficulty'],
                language=ch_data['language'],
                input_example=ch_data['input_example'],
                output_example=ch_data['output_example'],
                constraints=ch_data['constraints'],
                hints=ch_data['hints'],
                sample_solution=ch_data['sample_solution'],
                points=ch_data['points'],
            )
            db.session.add(ch)
    db.session.commit()


def seed_all():
    seed_badges()
    seed_lessons()
    seed_quizzes()
    seed_challenges()
    print("✅ Database seeded successfully!")
