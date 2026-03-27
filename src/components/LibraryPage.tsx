import { useState } from "react";
import { Search, Settings, Clock } from "lucide-react";

const filters = ["全部", "眼部", "下颌", "脸颊", "额头", "颈部"];

const categories = [
  {
    title: "眼部 & 上脸",
    routines: [
      {
        image: "https://images.pexels.com/photos/4465121/pexels-photo-4465121.jpeg?auto=compress&cs=tinysrgb&w=400",
        difficulty: "入门",
        name: "眼眶提升",
        duration: "8 分钟",
      },
      {
        image: "https://images.pexels.com/photos/5483244/pexels-photo-5483244.jpeg?auto=compress&cs=tinysrgb&w=400",
        difficulty: "进阶",
        name: "眉间舒展",
        duration: "12 分钟",
      },
    ],
  },
  {
    title: "下颌 & 轮廓",
    routines: [
      {
        image: "https://images.pexels.com/photos/5938367/pexels-photo-5938367.jpeg?auto=compress&cs=tinysrgb&w=400",
        difficulty: "中级",
        name: "雕塑塑形",
        duration: "15 分钟",
      },
      {
        image: "https://images.pexels.com/photos/5128057/pexels-photo-5128057.jpeg?auto=compress&cs=tinysrgb&w=400",
        difficulty: "入门",
        name: "颈部放松",
        duration: "10 分钟",
      },
    ],
  },
  {
    title: "脸颊 & 光泽",
    routines: [
      {
        image: "https://images.pexels.com/photos/6621245/pexels-photo-6621245.jpeg?auto=compress&cs=tinysrgb&w=400",
        difficulty: "中级",
        name: "苹果肌提升",
        duration: "7 分钟",
      },
      {
        image: "https://images.pexels.com/photos/6663292/pexels-photo-6663292.jpeg?auto=compress&cs=tinysrgb&w=400",
        difficulty: "入门",
        name: "晨间焕肤",
        duration: "5 分钟",
      },
    ],
  },
];

const LibraryPage = () => {
  const [activeFilter, setActiveFilter] = useState("全部");
  const [searchValue, setSearchValue] = useState("");

  const filteredCategories = categories
    .map((cat) => ({
      ...cat,
      routines: cat.routines.filter(
        (r) => !searchValue || r.name.toLowerCase().includes(searchValue.toLowerCase())
      ),
    }))
    .filter((cat) => {
      if (activeFilter === "全部") return cat.routines.length > 0;
      return cat.title.toLowerCase().includes(activeFilter.toLowerCase()) && cat.routines.length > 0;
    });

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 sticky top-0 bg-background/90 backdrop-blur-xl z-40">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold tracking-tight">课程库</h1>
          <button className="bg-transparent border-none cursor-pointer text-foreground p-1">
            <Settings className="w-6 h-6" />
          </button>
        </div>

        {/* Search */}
        <div className="bg-surface rounded-lg px-4 py-3 flex items-center gap-2.5 mb-4">
          <Search className="w-[18px] h-[18px] text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索课程..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="border-none bg-transparent text-sm text-foreground w-full outline-none placeholder:text-muted-foreground font-sans"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-all cursor-pointer border-none ${
                activeFilter === filter
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface-elevated text-muted-foreground hover:bg-surface-hover"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </header>

      {/* Grid */}
      <div className="px-6 pb-8">
        {filteredCategories.map((category, idx) => (
          <div key={idx} className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-foreground">{category.title}</h2>
              <span className="text-[13px] text-primary font-semibold cursor-pointer">查看全部</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {category.routines.map((routine, i) => (
                <div
                  key={i}
                  className="bg-card rounded-lg overflow-hidden shadow-sm cursor-pointer group relative"
                >
                  <img
                    src={routine.image}
                    alt={routine.name}
                    className="w-full h-[120px] object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-card/90 text-foreground tracking-wide">
                      {routine.difficulty}
                    </span>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold mb-1 text-foreground">{routine.name}</h3>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {routine.duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LibraryPage;
