import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface WorkoutLog {
  id: string;
  user_id: string;
  course_id: string;
  completed_at: string;
  duration_seconds: number;
  created_at: string;
}

export const useWorkoutLogs = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["workout-logs", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("workout_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false });
      if (error) throw error;
      return data as WorkoutLog[];
    },
    enabled: !!user,
  });
};

export const useWorkoutStats = () => {
  const { data: logs = [] } = useWorkoutLogs();
  const { data: courses = [] } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("id, category").order("created_at");
      if (error) throw error;
      return data;
    },
  });

  const totalWorkouts = logs.length;

  // Active weeks: count distinct ISO weeks
  const activeWeeks = new Set(
    logs.map((l) => {
      const d = new Date(l.completed_at);
      const year = d.getFullYear();
      const jan1 = new Date(year, 0, 1);
      const week = Math.ceil(((d.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7);
      return `${year}-W${week}`;
    })
  ).size;

  // Streak: consecutive days ending today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daySet = new Set(
    logs.map((l) => {
      const d = new Date(l.completed_at);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    })
  );
  let streak = 0;
  const checkDay = new Date(today);
  while (daySet.has(checkDay.getTime())) {
    streak++;
    checkDay.setDate(checkDay.getDate() - 1);
  }

  // Distinct categories worked
  const courseMap = new Map(courses?.map((c) => [c.id, c.category]) ?? []);
  const categories = new Set(logs.map((l) => courseMap.get(l.course_id)).filter(Boolean)).size;

  return { totalWorkouts, activeWeeks, streak, categories };
};

export const useWeeklyProgress = () => {
  const { data: logs = [] } = useWorkoutLogs();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayOfWeek = today.getDay(); // 0=Sun
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);

  const labels = ["一", "二", "三", "四", "五", "六", "日"];
  const counts = new Array(7).fill(0);

  logs.forEach((l) => {
    const d = new Date(l.completed_at);
    d.setHours(0, 0, 0, 0);
    const diff = Math.floor((d.getTime() - monday.getTime()) / 86400000);
    if (diff >= 0 && diff < 7) counts[diff]++;
  });

  const max = Math.max(...counts, 1);
  const activeDayIndex = Math.floor((today.getTime() - monday.getTime()) / 86400000);
  const daysWithWorkout = counts.filter((c) => c > 0).length;
  const percentage = Math.round((daysWithWorkout / 7) * 100);

  const weekData = labels.map((label, i) => ({
    label,
    height: counts[i] > 0 ? `${Math.max((counts[i] / max) * 100, 15)}%` : "0%",
    active: i === activeDayIndex,
  }));

  return { weekData, percentage };
};

export const useHeatmapData = () => {
  const { data: logs = [] } = useWorkoutLogs();

  // Build 20 weeks × 7 days = 140 cells
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayOfWeek = today.getDay(); // 0=Sun
  const endDate = new Date(today);
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - (19 * 7 + dayOfWeek));

  // Count per day
  const countMap = new Map<string, number>();
  logs.forEach((l) => {
    const d = new Date(l.completed_at);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    countMap.set(key, (countMap.get(key) || 0) + 1);
  });

  const cells: number[] = [];
  const cursor = new Date(startDate);
  for (let i = 0; i < 140; i++) {
    const key = `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`;
    const count = countMap.get(key) || 0;
    let level = 0;
    if (count >= 4) level = 4;
    else if (count >= 3) level = 3;
    else if (count >= 2) level = 2;
    else if (count >= 1) level = 1;
    cells.push(level);
    cursor.setDate(cursor.getDate() + 1);
  }

  return cells;
};

export const useRecentCourses = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["recent-courses", user?.id],
    queryFn: async () => {
      if (!user) return [];
      // Get recent distinct course IDs from logs
      const { data: logs, error: logErr } = await supabase
        .from("workout_logs")
        .select("course_id, completed_at")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false })
        .limit(20);
      if (logErr) throw logErr;

      const seenIds = new Set<string>();
      const uniqueIds: string[] = [];
      for (const l of logs || []) {
        if (!seenIds.has(l.course_id)) {
          seenIds.add(l.course_id);
          uniqueIds.push(l.course_id);
          if (uniqueIds.length >= 3) break;
        }
      }

      if (uniqueIds.length === 0) return [];

      const { data: courses, error } = await supabase
        .from("courses")
        .select("*")
        .in("id", uniqueIds);
      if (error) throw error;

      // Sort by original order
      return uniqueIds.map((id) => courses?.find((c) => c.id === id)).filter(Boolean);
    },
    enabled: !!user,
  });
};
