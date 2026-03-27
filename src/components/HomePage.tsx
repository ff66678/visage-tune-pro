import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Star, Crown } from "lucide-react";

const weekData = [
  { label: "M", height: "40%", active: false },
  { label: "T", height: "70%", active: false },
  { label: "W", height: "90%", active: false },
  { label: "T", height: "100%", active: true },
  { label: "F", height: "0%", active: false },
  { label: "S", height: "0%", active: false },
  { label: "S", height: "0%", active: false },
];

const recommendedItems = [
  {
    id: 1,
    img: "https://images.pexels.com/photos/4465121/pexels-photo-4465121.jpeg?auto=compress&cs=tinysrgb&w=400",
    tag: "Tired Eyes",
    name: "Orbital De-puff",
  },
  {
    id: 2,
    img: "https://images.pexels.com/photos/5938367/pexels-photo-5938367.jpeg?auto=compress&cs=tinysrgb&w=400",
    tag: "Structure",
    name: "Jawline Definition",
  },
];

const HomePage = () => {
  const [startClicked, setStartClicked] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      {/* Top Nav */}
      <nav className="flex justify-between items-center px-6 pt-8 pb-4 sticky top-0 bg-background/85 backdrop-blur-xl z-40">
        <div className="flex items-center gap-3">
          <img
            src="https://images.pexels.com/photos/3750717/pexels-photo-3750717.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2"
            className="w-10 h-10 rounded-full border-[1.5px] border-primary p-0.5 object-cover"
            alt="Avatar"
          />
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Good morning,</span>
            <span className="text-base font-semibold text-foreground">Elena</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/paywall")}
            className="bg-primary/10 border-none text-primary cursor-pointer px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-primary/15 transition-colors"
          >
            <Crown className="w-4 h-4" />
            <span className="text-xs font-semibold">PRO</span>
          </button>
          <button className="relative bg-transparent border-none text-foreground cursor-pointer p-2 rounded-full hover:bg-foreground/5 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
          </button>
        </div>
      </nav>

      {/* Weekly Progress */}
      <div className="mx-6 bg-surface rounded-3xl p-6 mb-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[15px] font-semibold">Weekly Progress</h2>
          <span className="text-[13px] text-primary font-semibold">85% of goal</span>
        </div>
        <div className="flex justify-between items-end">
          {weekData.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-8 h-[60px] bg-surface-elevated rounded-lg relative overflow-hidden">
                <div
                  className="absolute bottom-0 left-0 w-full bg-primary rounded-lg transition-all duration-1000"
                  style={{ height: day.height }}
                />
              </div>
              <span
                className={`text-[11px] font-medium ${
                  day.active ? "text-foreground font-bold" : "text-muted-foreground"
                }`}
              >
                {day.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Plan */}
      <h2 className="px-6 mt-8 mb-3 text-lg font-semibold tracking-tight">Today's Plan</h2>
      <div
        className="mx-6 rounded-3xl p-6 flex justify-between items-center text-primary-foreground"
        style={{ background: "var(--gradient-plan)", boxShadow: "0 10px 30px hsl(var(--primary-glow))" }}
      >
        <div>
          <h3 className="text-xl font-semibold mb-1">Full Face Sculpt</h3>
          <p className="text-[13px] opacity-90">15 min • High Intensity</p>
        </div>
        <button
          className="bg-card text-primary border-none px-5 py-2.5 rounded-full font-semibold text-sm cursor-pointer transition-all"
          style={{
            opacity: startClicked ? 0.8 : 1,
            transform: startClicked ? "scale(0.96)" : "scale(1)",
          }}
          onClick={() => {
            setStartClicked(true);
            setTimeout(() => setStartClicked(false), 300);
          }}
        >
          {startClicked ? "Starting..." : "Start Now"}
        </button>
      </div>

      {/* Recommended */}
      <h2 className="px-6 mt-8 mb-3 text-lg font-semibold tracking-tight">Recommended for You</h2>
      <div className="flex overflow-x-auto gap-4 px-6 pb-4 no-scrollbar">
        {recommendedItems.map((item) => (
          <div
            key={item.id}
            className="min-w-[240px] h-40 bg-surface-elevated rounded-lg relative overflow-hidden flex-shrink-0 cursor-pointer group"
          >
            <img
              src={item.img}
              alt={item.name}
              className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-foreground/70 to-transparent">
              <span className="text-[10px] uppercase tracking-wider text-background/80 bg-accent-gold/90 px-1.5 py-0.5 rounded font-bold mb-1.5 inline-block">
                {item.tag}
              </span>
              <h3 className="text-base font-semibold text-card m-0">{item.name}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Streak */}
      <div className="px-5 mt-2 mb-6">
        <div className="bg-surface rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent-gold/15 flex items-center justify-center text-accent-gold flex-shrink-0">
            <Star className="w-6 h-6" fill="currentColor" />
          </div>
          <div>
            <div className="text-sm font-semibold">12 Day Streak</div>
            <div className="text-xs text-muted-foreground">You're doing great, keep it up!</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
