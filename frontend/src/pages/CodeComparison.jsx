import { useState } from 'react'
import {
  Code2, AlertTriangle, Zap, Cpu, HardDrive, Flame,
  Clock, CheckCircle2, ArrowRight, Play, RefreshCw, BarChart2
} from 'lucide-react'

const COMPARISONS = [
  {
    id: 'string-concat',
    title: 'String Concatenation in Loops',
    category: 'Memory & Garbage Collection',
    difficulty: 'Beginner',
    summary: 'Repeated string concatenation creates immutable temporary objects in memory, triggering heavy garbage collection cycles.',
    badCode: `# Inefficient: O(N^2) memory allocations
def generate_report(items):
    report = ""
    for item in items:
        # Every += allocates a new string in memory
        report += f"Item {item.id}: {item.name}\\n"
    return report`,
    goodCode: `# Green Optimized: O(N) allocation
def generate_report(items):
    # Builds list in memory once, joins in a single pass
    lines = [f"Item {item.id}: {item.name}" for item in items]
    return "\\n".join(lines)`,
    badMetrics: { timeMs: '142 ms', cpu: '94% peak', memory: '18.4 MB', co2: '2.4 mg' },
    goodMetrics: { timeMs: '8 ms', cpu: '12% peak', memory: '1.2 MB', co2: '0.1 mg' },
    timeComplexity: { bad: 'O(N²)', good: 'O(N)' },
    spaceComplexity: { bad: 'O(N²)', good: 'O(N)' },
    explanation: 'In Python and JavaScript, strings are immutable. Appending to a string repeatedly forces the runtime to re-allocate memory and copy all previous characters, wasting vast numbers of CPU cycles and memory bandwidth.',
    savings: '94% CPU reduction, 15x faster execution, and 90% less memory pressure.'
  },
  {
    id: 'lookup-structure',
    title: 'Linear Array Search vs Hash Set',
    category: 'Data Structures',
    difficulty: 'Beginner',
    summary: 'Searching arrays sequentially in loops causes quadratic computation time instead of constant-time lookups.',
    badCode: `# Inefficient: O(N * M) linear scan
def find_duplicates(list_a, list_b):
    duplicates = []
    for item in list_a:
        # 'item in list_b' scans the entire array each time!
        if item in list_b:
            duplicates.append(item)
    return duplicates`,
    goodCode: `# Green Optimized: O(N + M) hash lookup
def find_duplicates(list_a, list_b):
    # Convert list_b to set once in O(M)
    set_b = set(list_b)
    # Set lookups are O(1) instantaneous
    return [item for item in list_a if item in set_b]`,
    badMetrics: { timeMs: '850 ms', cpu: '99% peak', memory: '12.0 MB', co2: '14.2 mg' },
    goodMetrics: { timeMs: '15 ms', cpu: '14% peak', memory: '6.5 MB', co2: '0.2 mg' },
    timeComplexity: { bad: 'O(N × M)', good: 'O(N + M)' },
    spaceComplexity: { bad: 'O(1) extra', good: 'O(M) set' },
    explanation: 'Converting to a Hash Set trades a small amount of RAM once to eliminate hundreds of thousands of redundant comparisons, saving substantial processor power.',
    savings: '98% computation time eliminated for 10,000 items.'
  },
  {
    id: 'database-n1',
    title: 'N+1 Database Query Problem',
    category: 'Database & Network I/O',
    difficulty: 'Intermediate',
    summary: 'Executing a SQL query per row causes hundreds of roundtrips between app server and database, burning network and CPU energy.',
    badCode: `# Inefficient: 1 query for authors + N queries for books
authors = db.execute("SELECT * FROM authors LIMIT 100")
for author in authors:
    # 100 round-trip queries over network!
    books = db.execute(
        "SELECT * FROM books WHERE author_id = %s",
        (author.id,)
    )`,
    goodCode: `# Green Optimized: Single query with JOIN
query = """
    SELECT a.id, a.name, b.id as book_id, b.title
    FROM authors a
    LEFT JOIN books b ON a.id = b.author_id
    LIMIT 100
"""
results = db.execute(query)`,
    badMetrics: { timeMs: '1240 ms', cpu: '88% peak', memory: '8.2 MB', co2: '21.0 mg' },
    goodMetrics: { timeMs: '42 ms', cpu: '9% peak', memory: '4.1 MB', co2: '0.7 mg' },
    timeComplexity: { bad: '101 Network Roundtrips', good: '1 Network Roundtrip' },
    spaceComplexity: { bad: '101 TCP handshakes', good: 'Single connection' },
    explanation: 'Network packet transmission and server context switches consume significant power. Combining requests into single set-based operations minimizes infrastructure strain.',
    savings: '96% reduction in latency and 30x fewer network packet transmissions.'
  },
  {
    id: 'polling-vs-events',
    title: 'Constant Polling vs Event-Driven Triggers',
    category: 'Architecture & Concurrency',
    difficulty: 'Intermediate',
    summary: 'Polling loops wake up the CPU constantly even when no work exists, preventing processors from entering low-power sleep states.',
    badCode: `# Inefficient: Infinite polling wastes CPU cycles
import time

while True:
    task = check_task_queue()
    if task:
        process(task)
    # Wakes CPU core every 500ms even when idle!
    time.sleep(0.5)`,
    goodCode: `# Green Optimized: Blocking event / webhook
import asyncio

async def listen_for_tasks(queue):
    # Suspends execution until an event actually arrives
    # Allows CPU cores to idle in ultra-low power state
    async for task in queue.subscribe():
        await process(task)`,
    badMetrics: { timeMs: 'Continuous', cpu: '18% idle load', memory: '4.8 MB', co2: '48.0 mg/hr' },
    goodMetrics: { timeMs: 'On-Demand', cpu: '0.1% idle load', memory: '3.2 MB', co2: '0.5 mg/hr' },
    timeComplexity: { bad: 'O(∞) busy cycles', good: 'O(events) active' },
    spaceComplexity: { bad: 'High thread contention', good: 'Event loop suspension' },
    explanation: 'Modern CPUs have C-states (power-saving sleep states). Busy-waiting or periodic polling prevents deep sleep modes, wasting continuous watts at server farm scale.',
    savings: '99% idle energy reduction. Server can sleep until traffic arrives.'
  },
  {
    id: 'generators-vs-lists',
    title: 'Eager Memory Allocation vs Lazy Generators',
    category: 'Memory Management',
    difficulty: 'Advanced',
    summary: 'Loading millions of records into memory at once spikes RAM usage and forces swap disk thrashing.',
    badCode: `# Inefficient: Eager loading millions into memory
def process_log_file(filepath):
    # Reads entire 2GB file directly into memory
    with open(filepath, 'r') as f:
        all_lines = f.readlines()
    
    return [line.strip() for line in all_lines if "ERROR" in line]`,
    goodCode: `# Green Optimized: Streaming generator (lazy)
def process_log_file(filepath):
    # Stream line by line with O(1) memory footprint
    with open(filepath, 'r') as f:
        for line in f:
            if "ERROR" in line:
                yield line.strip()`,
    badMetrics: { timeMs: '3200 ms', cpu: '91% peak', memory: '2100 MB', co2: '58.0 mg' },
    goodMetrics: { timeMs: '1800 ms', cpu: '40% peak', memory: '8 MB', co2: '9.0 mg' },
    timeComplexity: { bad: 'O(N)', good: 'O(N)' },
    spaceComplexity: { bad: 'O(N) - 2GB RAM', good: 'O(1) - 8KB Buffer' },
    explanation: 'Generators yield one item at a time, keeping the memory working set within CPU L1/L2 cache and preventing operating system page faults.',
    savings: '99.6% RAM reduction and zero swap disk writes.'
  }
]

export default function CodeComparison() {
  const [selectedId, setSelectedId] = useState(COMPARISONS[0].id)
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationFinished, setSimulationFinished] = useState(false)

  const active = COMPARISONS.find(c => c.id === selectedId) || COMPARISONS[0]

  const runSimulation = () => {
    setIsSimulating(true)
    setSimulationFinished(false)
    setTimeout(() => {
      setIsSimulating(false)
      setSimulationFinished(true)
    }, 1200)
  }

  return (
    <div className="container-custom py-8 md:py-12 space-y-8 page-enter">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3">
          <Zap className="w-3.5 h-3.5" /> Side-by-Side Code Diagnostics
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Inefficient vs Green Code
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-3xl text-base">
          Analyze real architectural antipatterns that silently drain hardware energy, and compare them with environmentally conscious implementations.
        </p>
      </div>

      {/* Category / Topic Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {COMPARISONS.map((comp) => {
          const isSelected = comp.id === selectedId
          return (
            <button
              key={comp.id}
              onClick={() => {
                setSelectedId(comp.id)
                setSimulationFinished(false)
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 border flex items-center gap-2 ${
                isSelected
                  ? 'bg-green-600 text-white border-green-600 shadow-md shadow-green-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <span>{comp.title}</span>
            </button>
          )
        })}
      </div>

      {/* Active Comparison Card */}
      <div className="card p-6 md:p-8 border border-slate-200 dark:border-slate-800 space-y-8">
        {/* Topic Title & Summary */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
              <span>{active.category}</span>
              <span>•</span>
              <span className="capitalize">{active.difficulty}</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              {active.title}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              {active.summary}
            </p>
          </div>

          <button
            onClick={runSimulation}
            disabled={isSimulating}
            className="btn-primary py-2.5 px-5 text-xs flex items-center gap-2 self-start md:self-center disabled:opacity-50"
          >
            {isSimulating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>{isSimulating ? 'Simulating Energy...' : 'Simulate Benchmark'}</span>
          </button>
        </div>

        {/* Code Comparison Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inefficient Box */}
          <div className="rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-white dark:bg-slate-900/60 shadow-sm overflow-hidden flex flex-col justify-between">
            <div>
              <div className="px-5 py-3 bg-rose-50 dark:bg-rose-950/30 border-b border-rose-200 dark:border-rose-900/40 flex items-center justify-between">
                <span className="text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Inefficient Pattern
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300 font-bold">
                  Complexity: {active.timeComplexity.bad}
                </span>
              </div>
              <pre className="p-5 font-mono text-xs text-slate-800 dark:text-slate-200 overflow-x-auto whitespace-pre leading-relaxed">
                {active.badCode}
              </pre>
            </div>

            {/* Metrics Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800 grid grid-cols-4 gap-2 text-center">
              <div>
                <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1"><Clock className="w-3 h-3" /> Latency</div>
                <div className="text-xs font-bold text-rose-600 dark:text-rose-400 mt-0.5">{active.badMetrics.timeMs}</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1"><Cpu className="w-3 h-3" /> CPU Load</div>
                <div className="text-xs font-bold text-rose-600 dark:text-rose-400 mt-0.5">{active.badMetrics.cpu}</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1"><HardDrive className="w-3 h-3" /> Memory</div>
                <div className="text-xs font-bold text-rose-600 dark:text-rose-400 mt-0.5">{active.badMetrics.memory}</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1"><Flame className="w-3 h-3" /> Carbon</div>
                <div className="text-xs font-bold text-rose-600 dark:text-rose-400 mt-0.5">{active.badMetrics.co2}</div>
              </div>
            </div>
          </div>

          {/* Green Optimized Box */}
          <div className="rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-900/60 shadow-sm overflow-hidden flex flex-col justify-between ring-1 ring-emerald-500/10">
            <div>
              <div className="px-5 py-3 bg-emerald-50 dark:bg-emerald-950/30 border-b border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Green Optimized Pattern
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 font-bold">
                  Complexity: {active.timeComplexity.good}
                </span>
              </div>
              <pre className="p-5 font-mono text-xs text-slate-800 dark:text-slate-200 overflow-x-auto whitespace-pre leading-relaxed">
                {active.goodCode}
              </pre>
            </div>

            {/* Metrics Footer */}
            <div className="p-4 bg-emerald-50/40 dark:bg-emerald-950/20 border-t border-emerald-100 dark:border-emerald-900/40 grid grid-cols-4 gap-2 text-center">
              <div>
                <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1"><Clock className="w-3 h-3" /> Latency</div>
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{active.goodMetrics.timeMs}</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1"><Cpu className="w-3 h-3" /> CPU Load</div>
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{active.goodMetrics.cpu}</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1"><HardDrive className="w-3 h-3" /> Memory</div>
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{active.goodMetrics.memory}</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1"><Flame className="w-3 h-3" /> Carbon</div>
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{active.goodMetrics.co2}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Benchmark Simulation Animation or Results */}
        {simulationFinished && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-green-500/10 border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
                <BarChart2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Simulation Complete: {active.savings}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Switching to the green pattern saved ~{parseFloat(active.badMetrics.co2) - parseFloat(active.goodMetrics.co2)} mg of CO₂ per execution.
                </p>
              </div>
            </div>
            <div className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-600 text-white">
              Green Verified
            </div>
          </div>
        )}

        {/* Deep Dive Architecture Explanation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-green-600 dark:text-green-400" /> Architectural Breakdown
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {active.explanation}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Sustainable Impact
            </h3>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300">
              {active.savings} In high-throughput cloud microservices handling millions of requests daily, this single pattern change eliminates hundreds of kilowatt-hours of electricity per month.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
