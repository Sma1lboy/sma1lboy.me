export interface Friend {
  id: string;
  name: string;
  title: string;
  description: string;
  avatar: string;
  website?: string;
  github?: string;
  twitter?: string;
  linkedin?: string;
  tags: string[];
  featured?: boolean;
}

export const friends: Friend[] = [
  {
    id: "alex-chen",
    name: "Alex Chen",
    title: "同窗好友 / CS Student",
    description:
      "一起在UW-Madison学CS的室友，总是能在我熬夜写代码的时候陪我聊天。对前端开发特别有热情，经常一起讨论React的新特性。",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    github: "https://github.com/alexchen",
    tags: ["React", "TypeScript", "学习伙伴", "室友"],
    featured: true,
  },
  {
    id: "sarah-kim",
    name: "Sarah Kim",
    title: "设计师朋友 / UI Designer",
    description:
      "在一次hackathon上认识的设计师朋友，她总能把我的糟糕想法变成漂亮的界面。现在偶尔还会一起合作一些小项目。",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    website: "https://sarahkim.design",
    github: "https://github.com/sarahkim",
    tags: ["UI/UX", "设计", "Hackathon", "合作伙伴"],
    featured: true,
  },
  {
    id: "mike-wang",
    name: "Mike Wang",
    title: "开源贡献者 / Open Source Enthusiast",
    description:
      "在GitHub上认识的朋友，经常一起为开源项目贡献代码。他教会了我很多关于代码质量和团队协作的知识。",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    github: "https://github.com/mikewang",
    twitter: "https://twitter.com/mikewang",
    tags: ["开源", "Go", "后端", "导师"],
  },
  {
    id: "jenny-liu",
    name: "Jenny Liu",
    title: "咖啡店老板 / Coffee Shop Owner",
    description:
      "我常去的咖啡店老板，也是个隐藏的技术大牛。经常在她店里写代码，偶尔会聊聊技术和创业的话题。",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    website: "https://jennyscoffee.com",
    tags: ["咖啡", "创业", "生活", "技术"],
    featured: true,
  },
  {
    id: "tom-brown",
    name: "Tom Brown",
    title: "游戏开发者 / Indie Game Dev",
    description:
      "在Discord上认识的独立游戏开发者，我们经常一起讨论游戏设计和编程。他正在开发一款很酷的像素风格游戏。",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    github: "https://github.com/tombrown",
    twitter: "https://twitter.com/tombrown_dev",
    tags: ["游戏开发", "Unity", "像素艺术", "独立开发"],
  },
  {
    id: "lisa-zhang",
    name: "Lisa Zhang",
    title: "学姐 / Graduate Student",
    description: "计算机系的学姐，现在在读研究生。经常给我学习和职业规划的建议，是个很温暖的人。",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    linkedin: "https://linkedin.com/in/lisazhang",
    tags: ["学姐", "研究生", "导师", "学术"],
  },
];
