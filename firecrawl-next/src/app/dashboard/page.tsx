"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import { Newspaper, TrendingUp, Users, Clock, BookOpen, BarChart3 } from 'lucide-react';

// Dynamic imports
const LineChart = dynamic(() => import('recharts').then((mod) => mod.LineChart), { ssr: false });
const Line = dynamic(() => import('recharts').then((mod) => mod.Line), { ssr: false });
const XAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then((mod) => mod.ResponsiveContainer), { ssr: false });
const PieChart = dynamic(() => import('recharts').then((mod) => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import('recharts').then((mod) => mod.Pie), { ssr: false });
const Cell = dynamic(() => import('recharts').then((mod) => mod.Cell), { ssr: false });

// Enhanced mock data
const newsData = [
  { 
    site: "Daily Chronicle",
    bias: 75,
    conservative: 75,
    liberal: 25,
    visits: 1243,
    avgReadTime: "8m",
    categories: ["Politics", "Economy"]
  },
  { 
    site: "Tech Insider",
    bias: 30,
    conservative: 30,
    liberal: 70,
    visits: 892,
    avgReadTime: "12m",
    categories: ["Technology", "Business"]
  },
  { 
    site: "The Centrist",
    bias: 50,
    conservative: 50,
    liberal: 50,
    visits: 1567,
    avgReadTime: "10m",
    categories: ["World News", "Politics"]
  },
  { 
    site: "Global Report",
    bias: 40,
    conservative: 40,
    liberal: 60,
    visits: 734,
    avgReadTime: "7m",
    categories: ["International", "Economy"]
  },
  { 
    site: "Morning Herald",
    bias: 80,
    conservative: 80,
    liberal: 20,
    visits: 921,
    avgReadTime: "9m",
    categories: ["Politics", "Opinion"]
  }
];

const weeklyData = [
  { name: 'Mon', conservative: 14, liberal: 8, total: 22 },
  { name: 'Tue', conservative: 11, liberal: 13, total: 24 },
  { name: 'Wed', conservative: 15, liberal: 11, total: 26 },
  { name: 'Thu', conservative: 8, liberal: 16, total: 24 },
  { name: 'Fri', conservative: 12, liberal: 14, total: 26 },
  { name: 'Sat', conservative: 18, liberal: 7, total: 25 },
  { name: 'Sun', conservative: 10, liberal: 15, total: 25 }
];

const topicData = [
  { name: "Politics", value: 35 },
  { name: "Economy", value: 25 },
  { name: "Technology", value: 20 },
  { name: "World News", value: 15 },
  { name: "Opinion", value: 5 }
];

const COLORS = ['#FF8042', '#00C49F', '#0088FE', '#FFBB28', '#FF6B6B'];

export default function Dashboard() {
  const totalArticles = weeklyData.reduce((acc, day) => acc + day.total, 0);
  const avgReadTime = Math.round(newsData.reduce((acc, site) => acc + parseInt(site.avgReadTime), 0) / newsData.length);
  
  const stats = [
    {
      title: "Articles Read",
      value: totalArticles,
      icon: BookOpen,
      color: "bg-blue-500"
    },
    {
      title: "Avg. Read Time",
      value: `${avgReadTime}m`,
      icon: Clock,
      color: "bg-green-500"
    },
    {
      title: "News Sources",
      value: newsData.length,
      icon: Newspaper,
      color: "bg-purple-500"
    },
    {
      title: "Top Category",
      value: "Politics",
      icon: TrendingUp,
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Media Bias Dashboard</h1>
          <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6 transition-transform hover:scale-105">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-500 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* News Sources */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-900">News Sources & Bias</h2>
            <div className="space-y-6">
              {newsData.map((source, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-gray-900">{source.site}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({source.categories.join(", ")})
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {source.visits.toLocaleString()} visits • {source.avgReadTime} avg
                    </span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full flex transition-all duration-300">
                      <div 
                        className="bg-red-500 h-full transition-all duration-300"
                        style={{ width: `${source.conservative}%` }}
                      />
                      <div 
                        className="bg-blue-500 h-full transition-all duration-300"
                        style={{ width: `${source.liberal}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Pattern */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-900">Weekly Reading Pattern</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="conservative" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="liberal" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Topic Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-6 text-gray-900">Topic Distribution</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topicData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {topicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {topicData.map((topic, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-gray-600">
                    {topic.name} ({topic.value}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}