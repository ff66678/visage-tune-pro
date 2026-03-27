import { useState, useMemo } from "react";
import { Settings, ChevronRight, MapPin, Clock, Star, Play, Share } from "lucide-react";

const heatColors: Record<number, string> = {
  0: "bg-surface-elevated",
  1: "bg-[hsl(0_20%_87%)]",
  2: "bg-[hsl(0_22%_79%)]",
  3: "bg-primary",
  4: "bg-[hsl(0_20%_56%)]",
};

const generateHeatmap = () => {
  const cells: number[] = [];
  for (let i = 0; i < 140; i++) {
    const p = i / 140;
    let level = 0;
    if (Math.random() < 0.2 + p * 0.5) {
      const r = Math.random();
      level = r > 0.9 ? 4 : r > 0.7 ? 3 : r > 0.4 ? 2 : 1;
    }
    cells.push(level);
  }
  return cells;
};

const stats = [
  { label: "总练习次数", value: "142" },
  { label: "活跃周数", value: "24" },
  { label: "连续打卡", value: "12" },
  { label: "锻炼肌群", value: "43" },
];

const listItems = [
  { img: "https://images.pexels.com/photos/4046316/pexels-photo-4046316.jpeg?auto=compress&cs=tinysrgb&w=200", title: "刮痧排毒", meta: "12 分钟", starred: true },
  { img: "https://images.pexels.com/photos/4465121/pexels-photo-4465121.jpeg?auto=compress&cs=tinysrgb&w=200", title: "眼眶提升", meta: "5 分钟", starred: false },
  { img: "https://images.pexels.com/photos/3762871/pexels-photo-3762871.jpeg?auto=compress&cs=tinysrgb&w=200", title: "颊肌放松", meta: "10 分钟", starred: false },
];

const ProfilePage = () => {
  const heatmapCells = useMemo(generateHeatmap, []);
  const [heroHovered, setHeroHovered] = useState(false);

  return (
    <div className="animate-fade-in pb-4">
      {/* Header */}
      <header className="flex justify-between items-center px-6 pt-6">
        <button className="w-10 h-10 rounded-full bg-transparent flex items-center justify-center text-foreground hover:bg-foreground/5 transition-colors border-none cursor-pointer">
          <Settings className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 rounded-full bg-transparent flex items-center justify-center text-foreground hover:bg-foreground/5 transition-colors border-none cursor-pointer">
          <ChevronRight className="w-5 h-5" />
        </button>
      </header>

      {/* Profile */}
      <section className="flex flex-col items-center -mt-2 px-6">
        <div className="relative mb-4">
          <img
            src="https://images.pexels.com/photos/3750717/pexels-photo-3750717.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2"
            alt="小美"
            className="w-[120px] h-[120px] rounded-full object-cover border-[3px] border-card bg-card shadow-md"
          />
          <div className="absolute bottom-1 right-1 w-7 h-7 bg-foreground text-primary-foreground rounded-full flex items-center justify-center text-base font-semibold border-[3px] border-background">
            +
          </div>
        </div>
        <h1 className="text-[28px] font-semibold tracking-tight mb-2">小美</h1>
        <div className="flex gap-4 text-[13px] text-muted-foreground font-medium">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            纽约
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-accent-gold" />
            8月12日加入
          </span>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2.5 px-6 mt-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-surface rounded-xl p-4 flex flex-col gap-1">
            <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
            <span className="text-2xl font-semibold tracking-tight tabular-nums">{s.value}</span>
          </div>
        ))}
      </div>

      <div className="h-px bg-foreground/5 mx-6 my-8" />

      {/* Consistency Log */}
      <div className="px-6 mb-4">
        <h2 className="text-xl font-semibold tracking-tight mb-0.5">坚持记录</h2>
        <p className="text-sm text-muted-foreground">过去十二周的练习回顾</p>
      </div>
      <div className="px-6 flex gap-2 items-end">
        <div className="flex flex-col justify-between h-[100px] pb-0.5">
          {["D", "N", "O", "S", "A", "J", "J"].map((l, i) => (
            <span key={i} className="text-[10px] text-muted-foreground uppercase font-medium leading-none">
              {l}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-[repeat(20,1fr)] grid-rows-[repeat(7,1fr)] gap-1 flex-grow">
          {heatmapCells.map((level, i) => (
            <div key={i} className={`aspect-square rounded-[4px] ${heatColors[level]}`} />
          ))}
        </div>
      </div>

      <div className="h-px bg-foreground/5 mx-6 my-8" />

      {/* Chart */}
      <div className="px-6 mb-4">
        <h2 className="text-xl font-semibold tracking-tight mb-0.5">紧张缓解</h2>
        <p className="text-sm text-muted-foreground">你的肌肉紧张度变化</p>
      </div>
      <div className="px-6 mt-4 relative h-[140px] flex">
        <div className="flex flex-col justify-between h-full pr-3 border-r border-foreground/5 z-[2]">
          {["100", "80", "60", "40", "20", "0"].map((v) => (
            <span key={v} className="text-[10px] text-muted-foreground tabular-nums font-medium">
              {v}
            </span>
          ))}
        </div>
        <div className="flex-grow relative h-full overflow-hidden">
          <svg className="w-full h-full absolute bottom-0 left-0" viewBox="0 0 300 140" preserveAspectRatio="none">
            <defs>
              <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(0 27% 60% / 0.3)" />
                <stop offset="100%" stopColor="hsl(0 27% 60% / 0)" />
              </linearGradient>
            </defs>
            <path fill="url(#cg)" d="M 0 140 L 0 120 Q 30 120 50 100 T 100 110 T 150 90 T 200 80 T 250 20 T 290 100 L 300 100 L 300 140 Z" />
            <path fill="none" stroke="hsl(0 27% 60%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M 0 120 Q 30 120 50 100 T 100 110 T 150 90 T 200 80 T 250 20 T 290 100 L 300 100" />
            <circle fill="hsl(0 27% 60%)" opacity="0.3" cx="290" cy="100" r="8" />
            <circle fill="hsl(0 27% 60%)" cx="290" cy="100" r="4" />
          </svg>
        </div>
      </div>

      <div className="h-px bg-foreground/5 mx-6 my-8" />

      {/* Hero Card */}
      <div
        className="mx-6 rounded-3xl overflow-hidden relative h-[220px] bg-surface cursor-pointer shadow-sm"
        onMouseEnter={() => setHeroHovered(true)}
        onMouseLeave={() => setHeroHovered(false)}
      >
        <img
          src="https://images.pexels.com/photos/5938367/pexels-photo-5938367.jpeg?auto=compress&cs=tinysrgb&w=800"
          alt="面部按摩"
          className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-500"
          style={{ transform: heroHovered ? "scale(1.03)" : "scale(1)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent flex flex-col justify-between p-4 px-6">
          <div className="flex justify-between items-center">
            <span className="text-[13px] text-card/90 font-medium">8 分钟</span>
            <div className="flex gap-1.5">
              {[0, 1, 2, 3].map((d) => (
                <div key={d} className={`w-1.5 h-1.5 rounded-full ${d === 0 ? "bg-card" : "bg-card/40"}`} />
              ))}
            </div>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <div className="text-[13px] text-card/80 font-semibold uppercase tracking-wider mb-0.5">下一个</div>
              <div className="text-2xl font-semibold tracking-tight text-card">下颌线塑形</div>
            </div>
            <button className="w-11 h-11 rounded-full bg-card/95 flex items-center justify-center border-none text-primary shadow-lg cursor-pointer">
              <Play className="w-[18px] h-[18px]" fill="currentColor" />
            </button>
          </div>
        </div>
      </div>

      {/* List Cards */}
      <div className="px-6 mt-6 flex flex-col gap-3">
        {listItems.map((item, i) => (
          <div
            key={i}
            className="bg-surface rounded-xl p-3 flex items-center gap-4 cursor-pointer hover:bg-surface-hover transition-colors"
          >
            <div className="w-[68px] h-[68px] rounded-lg bg-surface-elevated relative overflow-hidden flex-shrink-0">
              <img src={item.img} alt={item.title} className="w-full h-full object-cover opacity-90" />
              {item.starred && (
                <div className="absolute inset-0 flex items-center justify-center text-accent-gold bg-foreground/10">
                  <Star className="w-5 h-5" fill="currentColor" />
                </div>
              )}
            </div>
            <div className="flex-grow flex flex-col justify-center">
              <div className="text-base font-semibold mb-0.5">{item.title}</div>
              <div className="text-[13px] text-muted-foreground font-medium">{item.meta}</div>
            </div>
            <div className="w-10 flex justify-center items-center text-muted-foreground/60">
              {item.starred ? <Share className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </div>
          </div>
        ))}
      </div>

      {/* Promo */}
      <div className="flex flex-col items-center text-center px-6 mt-8 mb-12">
        <div className="inline-flex items-center gap-2 bg-card border border-foreground/[0.04] px-4 py-2 pl-2 rounded-full text-sm font-semibold shadow-sm mb-4">
          <div className="w-6 h-6 rounded-full bg-accent-gold flex items-center justify-center text-card text-xs shadow-md">
            +
          </div>
          尊享会员
        </div>
        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
          解锁进阶筋膜训练课程<br />
          升级 <span className="text-foreground font-semibold">尊享会员</span>
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
