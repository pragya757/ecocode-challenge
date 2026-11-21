import { useState, useMemo } from 'react'
import { Flame, Trophy, Calendar, Sparkles, CheckCircle2 } from 'lucide-react'

// Month names abbreviation
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function GreenHeatmap({ activityData, streak = 0, longestStreak = 0 }) {
  const [hoveredDay, setHoveredDay] = useState(null)

  // Generate 52 weeks (364 days) leading up to today
  const { weeks, monthLabels, totalCount, activeDays } = useMemo(() => {
    const activityMap = activityData?.activity_map || {}
    const today = new Date()
    
    // Normalize today
    const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    
    // Find the end day of week (0 = Sun, ..., 6 = Sat)
    const endDayOfWeek = endDate.getDay()
    
    // We want 52 full weeks (364 days) + remaining days of current week
    const totalDays = 52 * 7 + (endDayOfWeek + 1)
    const startDate = new Date(endDate)
    startDate.setDate(endDate.getDate() - totalDays + 1)

    const allDays = []
    let curr = new Date(startDate)
    let total = 0
    let active = 0

    while (curr <= endDate) {
      const yyyy = curr.getFullYear()
      const mm = String(curr.getMonth() + 1).padStart(2, '0')
      const dd = String(curr.getDate()).padStart(2, '0')
      const dateStr = `${yyyy}-${mm}-${dd}`
      const count = activityMap[dateStr] || 0

      if (count > 0) {
        total += count
        active += 1
      }

      allDays.push({
        dateStr,
        dateObj: new Date(curr),
        count,
        dayOfWeek: curr.getDay(),
        month: curr.getMonth(),
        dayOfMonth: curr.getDate()
      })

      curr.setDate(curr.getDate() + 1)
    }

    // Group into 7-day columns (weeks)
    const weekCols = []
    let currentWeek = []

    allDays.forEach((day) => {
      currentWeek.push(day)
      if (currentWeek.length === 7) {
        weekCols.push(currentWeek)
        currentWeek = []
      }
    })
    if (currentWeek.length > 0) {
      weekCols.push(currentWeek)
    }

    // Calculate month label positions
    const mLabels = []
    let lastMonth = -1

    weekCols.forEach((wk, colIdx) => {
      const firstDay = wk[0]
      if (firstDay && firstDay.month !== lastMonth) {
        mLabels.push({
          colIdx,
          name: MONTH_NAMES[firstDay.month]
        })
        lastMonth = firstDay.month
      }
    })

    return {
      weeks: weekCols,
      monthLabels: mLabels,
      totalCount: total || activityData?.total_contributions || 0,
      activeDays: active || activityData?.active_days || 0
    }
  }, [activityData])

  // Get color intensity based on count
  const getCellColor = (count) => {
    if (count === 0) return 'bg-slate-100 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-800'
    if (count === 1) return 'bg-emerald-800 text-white'
    if (count <= 3) return 'bg-emerald-600 text-white'
    if (count <= 5) return 'bg-emerald-500 text-white'
    return 'bg-lime-400 text-slate-950 shadow-sm shadow-lime-400/40 ring-1 ring-lime-300'
  }

  return (
    <div className="card p-6 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md space-y-6">
      {/* Top Header & Streak Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-500" />
              Green Contribution Heatmap
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/20">
              Last 365 Days
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track daily lessons learned, coding challenges solved, and green points earned.
          </p>
        </div>

        {/* Streaks Callout */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <div>
              <div className="text-xs font-black text-amber-600 dark:text-amber-400 leading-none">
                {streak || activityData?.current_streak || 0} Days
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                Current Streak
              </div>
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-emerald-500" />
            <div>
              <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 leading-none">
                {longestStreak || activityData?.longest_streak || 0} Days
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                Longest Streak
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Grid Container */}
      <div className="relative overflow-x-auto pb-2">
        <div className="inline-block min-w-[750px]">
          {/* Month Labels */}
          <div className="flex text-[10px] font-semibold text-slate-400 dark:text-slate-500 mb-1.5 pl-7">
            {monthLabels.map((m, idx) => (
              <div
                key={idx}
                style={{
                  position: 'relative',
                  left: `${m.colIdx * 14}px`,
                  marginRight: '18px'
                }}
                className="whitespace-nowrap"
              >
                {m.name}
              </div>
            ))}
          </div>

          {/* Grid Rows */}
          <div className="flex gap-1.5 items-start">
            {/* Day Labels (Mon, Wed, Fri) */}
            <div className="flex flex-col gap-[3px] text-[9px] font-bold text-slate-400 dark:text-slate-500 pt-[2px] pr-1 select-none">
              <span className="h-3 flex items-center">Mon</span>
              <span className="h-3 flex items-center opacity-0">Tue</span>
              <span className="h-3 flex items-center">Wed</span>
              <span className="h-3 flex items-center opacity-0">Thu</span>
              <span className="h-3 flex items-center">Fri</span>
              <span className="h-3 flex items-center opacity-0">Sat</span>
              <span className="h-3 flex items-center opacity-0">Sun</span>
            </div>

            {/* Weeks Columns */}
            <div className="flex gap-[3.5px]">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-[3.5px]">
                  {week.map((day) => {
                    const isHovered = hoveredDay?.dateStr === day.dateStr
                    return (
                      <div
                        key={day.dateStr}
                        onMouseEnter={() => setHoveredDay(day)}
                        onMouseLeave={() => setHoveredDay(null)}
                        className={`w-3 h-3 rounded-[3px] transition-all cursor-pointer ${getCellColor(
                          day.count
                        )} ${isHovered ? 'scale-125 z-10 ring-2 ring-emerald-400' : 'hover:scale-110'}`}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Summary & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div>
          {hoveredDay ? (
            <span className="font-semibold text-slate-800 dark:text-slate-200 animate-fade-in flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              {hoveredDay.count === 0 ? 'No contributions' : `${hoveredDay.count} green contribution${hoveredDay.count > 1 ? 's' : ''}`}{' '}
              on {hoveredDay.dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          ) : (
            <span>
              Total: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{totalCount}</strong> green actions across{' '}
              <strong className="text-slate-700 dark:text-slate-300 font-bold">{activeDays}</strong> active days
            </span>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[11px] self-end sm:self-auto select-none">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded-[2px] bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-800" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-800" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-600" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-lime-400" />
          <span>More</span>
        </div>
      </div>
    </div>
  )
}
