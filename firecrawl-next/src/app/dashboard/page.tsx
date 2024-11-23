"use client";

import * as React from 'react';
import dynamic from 'next/dynamic';
import { Newspaper, TrendingUp, Users, Clock, BookOpen, BarChart3, Brain, Activity, AlertCircle } from 'lucide-react';

// Dynamic imports (same as before)
const LineChart = dynamic(() => import('recharts').then((mod) => mod.LineChart), { ssr: false });
const Line = dynamic(() => import('recharts').then((mod) => mod.Line), { ssr: false });
const XAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then((mod) => mod.ResponsiveContainer), { ssr: false });
const PieChart = dynamic(() => import('recharts').then((mod) => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import('recharts').then((mod) => mod.Pie), { ssr: false });
const Cell = dynamic(() => import('recharts').then((mod) => mod.Cell), { ssr: false });

// Enhanced realistic mock data
const newsData = [
  { 
    site: "The New York Times",
    bias: 35,
    conservative: 35,
    liberal: 65,
    visits: 47,
    articles: 12,
    avgReadTime: "6.2m",
    categories: ["Politics", "Economy"],
    lastRead: "2 hours ago",
    topAuthors: ["David Brooks", "Paul Krugman"],
    timeOfDay: "Morning",
    engagement: "High"
  },
  { 
    site: "Wall Street Journal",
    bias: 65,
    conservative: 65,
    liberal: 35,
    visits: 38,
    articles: 8,
    avgReadTime: "7.8m",
    categories: ["Business", "Finance"],
    lastRead: "45 minutes ago",
    topAuthors: ["James Mackintosh", "Greg Ip"],
    timeOfDay: "Afternoon",
    engagement: "Medium"
  },
  { 
    site: "Reuters",
    bias: 50,
    conservative: 50,
    liberal: 50,
    visits: 92,
    articles: 23,
    avgReadTime: "4.5m",
    categories: ["World News", "Markets"],
    lastRead: "5 minutes ago",
    topAuthors: ["Steve Holland", "Jeff Mason"],
    timeOfDay: "All Day",
    engagement: "Very High"
  },
  { 
    site: "The Atlantic",
    bias: 25,
    conservative: 25,
    liberal: 75,
    visits: 15,
    articles: 4,
    avgReadTime: "12.3m",
    categories: ["Long Form", "Analysis"],
    lastRead: "3 hours ago",
    topAuthors: ["Annie Lowrey", "Derek Thompson"],
    timeOfDay: "Evening",
    engagement: "Deep"
  },
  { 
    site: "Fox News",
    bias: 85,
    conservative: 85,
    liberal: 15,
    visits: 28,
    articles: 7,
    avgReadTime: "5.1m",
    categories: ["Politics", "Opinion"],
    lastRead: "1 hour ago",
    topAuthors: ["Tucker Carlson", "Sean Hannity"],
    timeOfDay: "Evening",
    engagement: "Medium"
  }
];

// Hourly reading pattern for today
const dailyPattern = [
  { hour: "6AM", articles: 3, conservative: 2, liberal: 1, topic: "Morning Briefing" },
  { hour: "8AM", articles: 8, conservative: 3, liberal: 5, topic: "Breaking News" },
  { hour: "10AM", articles: 12, conservative: 5, liberal: 7, topic: "Politics" },
  { hour: "12PM", articles: 7, conservative: 4, liberal: 3, topic: "Business" },
  { hour: "2PM", articles: 9, conservative: 3, liberal: 6, topic: "Technology" },
  { hour: "4PM", articles: 11, conservative: 6, liberal: 5, topic: "Markets Close" },
  { hour: "6PM", articles: 14, conservative: 8, liberal: 6, topic: "Evening News" },
  { hour: "8PM", articles: 6, conservative: 2, liberal: 4, topic: "Analysis" },
  { hour: "10PM", articles: 4, conservative: 3, liberal: 1, topic: "Late Updates" }
];

const topicData = [
  { name: "Politics", value: 32, articles: 156, avgTime: "6.7m" },
  { name: "Economy", value: 28, articles: 134, avgTime: "5.9m" },
  { name: "Technology", value: 15, articles: 89, avgTime: "4.2m" },
  { name: "World News", value: 18, articles: 112, avgTime: "5.5m" },
  { name: "Opinion", value: 7, articles: 45, avgTime: "8.1m" }
];

const engagementMetrics = {
  deepReads: 23, // articles read for > 10 minutes
  quickScans: 48, // articles read for < 2 minutes
  averageDepth: "65%", // average scroll depth
  returnRate: "42%", // percentage of articles returned to later
  shareRate: "15%", // percentage of articles shared
  mostProductiveTime: "10AM-12PM",
  leastProductiveTime: "2PM-4PM",
  averageSessionLength: "18 minutes"
};

const COLORS = ['#FF8042', '#00C49F', '#0088FE', '#FFBB28', '#FF6B6B'];

const Dashboard: React.FC = () => {
  const totalArticles = newsData.reduce((acc, site) => acc + site.articles, 0);
  const avgReadTime = (newsData.reduce((acc, site) => acc + parseFloat(site.avgReadTime), 0) / newsData.length).toFixed(1);
  
  // Calculate bias tendencies
  const totalConservativeReads = dailyPattern.reduce((acc, hour) => acc + hour.conservative, 0);
  const totalLiberalReads = dailyPattern.reduce((acc, hour) => acc + hour.liberal, 0);
  const biasPercentage = Math.round((totalConservativeReads / (totalConservativeReads + totalLiberalReads)) * 100);
  
  // Generate reading pattern summary
  const getReadingSummary = () => {
    const mostReadSite = newsData.reduce((prev, current) => 
      (prev.visits > current.visits) ? prev : current
    );
    const mostReadTopic = topicData.reduce((prev, current) => 
      (prev.value > current.value) ? prev : current
    );
    const peakReadingHour = dailyPattern.reduce((prev, current) => 
      (prev.articles > current.articles) ? prev : current
    );

    return {
      primarySource: mostReadSite.site,
      favoriteTime: peakReadingHour.hour,
      mainTopic: mostReadTopic.name,
      bias: biasPercentage > 55 ? "conservative" : biasPercentage < 45 ? "liberal" : "balanced",
      readingStyle: engagementMetrics.deepReads > engagementMetrics.quickScans ? "thorough" : "scanner"
    };
  };

  const summary = getReadingSummary();

  const stats = [
    {
      title: "Articles Today",
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
      title: "Deep Reads",
      value: engagementMetrics.deepReads,
      icon: Brain,
      color: "bg-purple-500"
    },
    {
      title: "Peak Time",
      value: engagementMetrics.mostProductiveTime,
      icon: Activity,
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Media Analysis Dashboard</h1>
          <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</div>
        </div>

        {/* Reading Pattern Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center">
            <Brain className="mr-2 text-blue-500" />
            Reading Pattern Analysis
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Your reading pattern shows a <span className="font-medium">{summary.bias}</span> lean, with most activity during 
            {' '}<span className="font-medium">{summary.favoriteTime}</span>. You frequently visit 
            {' '}<span className="font-medium">{summary.primarySource}</span> and show particular interest in 
            {' '}<span className="font-medium">{summary.mainTopic}</span> content. Your reading style is 
            {' '}<span className="font-medium">{summary.readingStyle}</span>, with an average session length of 
            {' '}<span className="font-medium">{engagementMetrics.averageSessionLength}</span>.
          </p>
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
                    <div className="text-right">
                      <span className="text-sm text-gray-500">
                        {source.visits} visits • {source.avgReadTime} avg
                      </span>
                      <div className="text-xs text-gray-400">
                        Last read: {source.lastRead}
                      </div>
                    </div>
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
                  <div className="text-xs text-gray-400 flex justify-between">
                    <span>Engagement: {source.engagement}</span>
                    <span>Time: {source.timeOfDay}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Reading Pattern */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-900">Today's Reading Pattern</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyPattern}>
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white shadow rounded p-3 text-sm">
                          <p className="font-bold">{label}</p>
                          <p className="text-red-500">Conservative: {payload[0].value}</p>
                          <p className="text-blue-500">Liberal: {payload[1].value}</p>
                          <p className="text-gray-500">Topic: {payload[0].payload.topic}</p>
                        </div>
                      );
                    }
                    return null;
                  }} />
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

        {/* Topic Distribution and Engagement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  <Tooltip content={({ active, payload }) => {
                    if (active && payload && payload[0]) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white shadow rounded p-3 text-sm">
                          <p className="font-bold">{data.name}</p>
                          <p>Percentage: {data.value}%</p>
                          <p>Articles: {data.articles}</p>
                          <p>Avg Time: {data.avgTime}</p>
                        </div>
                      );
                    }
                    return null;
                  }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
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

          {/* Engagement Metrics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-900">Reading Engagement</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Deep Reads</div>
                <div className="text-2xl font-bold text-gray-900">{engagementMetrics.deepReads}</div>
                <div className="text-xs text-gray-400">articles &gt; 10 min</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Quick Scans</div>
                <div className="text-2xl font-bold text-gray-900">{engagementMetrics.quickScans}</div>
                <div className="text-xs text-gray-400">articles &lt; 2 min</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Avg. Scroll Depth</div>
                <div className="text-2xl font-bold text-gray-900">{engagementMetrics.averageDepth}</div>
                <div className="text-xs text-gray-400">of article length</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Return Rate</div>
                <div className="text-2xl font-bold text-gray-900">{engagementMetrics.returnRate}</div>
                <div className="text-xs text-gray-400">articles revisited</div>
              </div>
            </div>

            {/* Time Analysis */}
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Reading Time Analysis</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Most Productive</span>
                  <span className="text-sm font-medium text-green-600">{engagementMetrics.mostProductiveTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Least Active</span>
                  <span className="text-sm font-medium text-red-600">{engagementMetrics.leastProductiveTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avg. Session</span>
                  <span className="text-sm font-medium text-blue-600">{engagementMetrics.averageSessionLength}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Share Rate</span>
                  <span className="text-sm font-medium text-purple-600">{engagementMetrics.shareRate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reading Habits Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Reading Habits Insights</h2>
              <div className="prose text-gray-600">
                <p className="mb-2">
                  Your reading pattern shows a diverse media diet with a slight {summary.bias} lean. 
                  You're most active during {engagementMetrics.mostProductiveTime}, typically spending 
                  {' '}{engagementMetrics.averageSessionLength} per session.
                </p>
                <p className="mb-2">
                  You tend to engage deeply with {summary.mainTopic} content, spending an average of 
                  {' '}{avgReadTime} minutes per article. {summary.primarySource} is your most frequently 
                  visited source, suggesting a preference for their coverage style.
                </p>
                <p>
                  Your reading style is primarily {summary.readingStyle}, with {engagementMetrics.deepReads} deep 
                  reads and a {engagementMetrics.returnRate} return rate, indicating thorough engagement with 
                  complex topics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;