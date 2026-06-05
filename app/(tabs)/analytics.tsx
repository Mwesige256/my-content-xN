import { useState } from "react";
import { SafeAreaView, ScrollView, Text, View, Card, CardContent, Pressable, Badge } from "@/components/ui";
import { TrendingUp, TrendingDown, Eye, Clock, MousePointer, Heart, MessageCircle, Share2, Bookmark, Zap, AlertTriangle, CheckCircle, BarChart2 } from "lucide-react-native";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const timeRanges = [
  { id: "24h", label: "Last 24h" },
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
  { id: "90d", label: "Last 90 days" },
];

export default function AnalyticsScreen() {
  const [timeRange, setTimeRange] = useState("7d");
  
  const summary = useQuery(api.analytics.getAnalyticsSummary);
  const recommendations = useQuery(api.analytics.getRecommendations);
  const topPerforming = useQuery(api.analytics.getTopPerforming, { limit: 5 }) ?? [];

  const hasData = summary && summary.totalViews > 0;

  const metrics = summary ? [
    { label: "Avg Watch Time", value: `${summary.avgWatchTime}s`, change: "+18%", trend: "up", icon: Clock },
    { label: "Avg CTR", value: `${summary.avgCtr}%`, change: "+2.1%", trend: "up", icon: MousePointer },
    { label: "Avg Engagement", value: `${summary.avgEngagement}%`, change: "+5.3%", trend: "up", icon: Heart },
    { label: "Total Shares", value: summary.totalShares.toString(), change: "-0.5%", trend: summary.totalShares > 0 ? "up" : "down", icon: Share2 },
  ] : [];

  if (!hasData) {
    return (
      <SafeAreaView edges={["top"]} className="flex-1 bg-background">
        <ScrollView className="flex-1" contentContainerClassName="p-6">
          <View className="mb-6">
            <Text variant="muted" className="mb-1">Step 7</Text>
            <Text variant="h1" className="text-3xl">Analytics Review</Text>
            <Text variant="muted" className="mt-2">
              Performance analysis and content recommendations.
            </Text>
          </View>

          <Card className="bg-muted/50 mb-6">
            <CardContent className="p-5">
              <Text className="text-center text-muted-foreground mb-4">
                No analytics data yet. Start posting content and track your performance here.
              </Text>
              <Text className="text-center text-sm text-muted-foreground">
                Analytics will automatically appear once you begin scheduling and posting content.
              </Text>
            </CardContent>
          </Card>

          {recommendations && (
            <>
              <Text variant="h3" className="mb-4">General Recommendations</Text>
              <Card className="mb-4 border-blue-500/30">
                <CardContent className="p-4">
                  <View className="flex-row items-center mb-3">
                    <BarChart2 size={20} className="text-blue-500 mr-2" />
                    <Text className="font-semibold text-blue-600">Getting Started Tips</Text>
                  </View>
                  <View className="gap-2">
                    {recommendations.opportunities.slice(0, 3).map((item, index) => (
                      <View key={index} className="flex-row items-start">
                        <View className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-3" />
                        <Text variant="muted" className="text-sm flex-1">{item}</Text>
                      </View>
                    ))}
                  </View>
                </CardContent>
              </Card>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerClassName="p-6 pb-24">
        {/* Header */}
        <View className="mb-6">
          <Text variant="muted" className="mb-1">Step 7</Text>
          <Text variant="h1" className="text-3xl">Analytics Review</Text>
          <Text variant="muted" className="mt-2">
            Performance analysis and content recommendations.
          </Text>
        </View>

        {/* Time Range Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
          <View className="flex-row gap-2">
            {timeRanges.map((range) => (
              <Pressable
                key={range.id}
                onPress={() => setTimeRange(range.id)}
                className={`px-4 py-2 rounded-full ${
                  timeRange === range.id ? "bg-primary" : "bg-muted"
                }`}
              >
                <Text 
                  className={`text-sm font-medium ${
                    timeRange === range.id ? "text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  {range.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {/* Key Metrics */}
        <View className="flex-row flex-wrap gap-3 mb-6">
          {metrics.map((metric, index) => (
            <Card key={index} className="flex-1 min-w-[45%]">
              <CardContent className="p-4">
                <View className="flex-row items-center justify-between mb-2">
                  <metric.icon size={18} className="text-primary" />
                  <View className={`flex-row items-center px-2 py-0.5 rounded-full ${
                    metric.trend === "up" ? "bg-green-500/10" : "bg-red-500/10"
                  }`}>
                    {metric.trend === "up" ? (
                      <TrendingUp size={12} className="text-green-500 mr-1" />
                    ) : (
                      <TrendingDown size={12} className="text-red-500 mr-1" />
                    )}
                    <Text className={`text-xs font-medium ${
                      metric.trend === "up" ? "text-green-500" : "text-red-500"
                    }`}>
                      {metric.change}
                    </Text>
                  </View>
                </View>
                <Text variant="h2" className="text-2xl">{metric.value}</Text>
                <Text variant="muted" className="text-xs">{metric.label}</Text>
              </CardContent>
            </Card>
          ))}
        </View>

        {/* Top Performing Content */}
        {topPerforming.length > 0 && (
          <>
            <Text variant="h3" className="mb-4">Top Performing Content</Text>
            <View className="gap-3 mb-6">
              {topPerforming.map((content: any, index: number) => (
                <Card key={index} className="bg-card">
                  <CardContent className="p-4">
                    <View className="flex-row items-start justify-between mb-3">
                      <Text className="font-semibold flex-1 pr-4" numberOfLines={2}>{content.title}</Text>
                      <Badge variant="default" className="ml-2">
                        <Text className="text-xs text-primary-foreground">#{index + 1}</Text>
                      </Badge>
                    </View>
                    
                    <View className="flex-row flex-wrap gap-4 mb-3">
                      <View className="flex-row items-center">
                        <Eye size={14} className="text-muted-foreground mr-1.5" />
                        <Text className="text-sm font-medium">{content.views.toLocaleString()}</Text>
                      </View>
                      <View className="flex-row items-center">
                        <Clock size={14} className="text-muted-foreground mr-1.5" />
                        <Text className="text-sm">{content.watchTime}s</Text>
                      </View>
                      <View className="flex-row items-center">
                        <Heart size={14} className="text-muted-foreground mr-1.5" />
                        <Text className="text-sm">{content.engagement}%</Text>
                      </View>
                      <View className="flex-row items-center">
                        <Bookmark size={14} className="text-muted-foreground mr-1.5" />
                        <Text className="text-sm">{content.saves}</Text>
                      </View>
                      <View className="flex-row items-center">
                        <Share2 size={14} className="text-muted-foreground mr-1.5" />
                        <Text className="text-sm">{content.shares}</Text>
                      </View>
                    </View>
                    
                    <View className="flex-row items-center bg-green-500/10 p-2 rounded-lg">
                      <Zap size={14} className="text-green-500 mr-2" />
                      <Text className="text-green-600 text-xs font-medium">Why it worked: {content.why}</Text>
                    </View>
                  </CardContent>
                </Card>
              ))}
            </View>
          </>
        )}

        {/* Recommendations */}
        {recommendations && (
          <>
            <Text variant="h3" className="mb-4">Strategic Recommendations</Text>
            
            {/* Double Down */}
            <Card className="mb-4 border-green-500/30">
              <CardContent className="p-4">
                <View className="flex-row items-center mb-3">
                  <CheckCircle size={20} className="text-green-500 mr-2" />
                  <Text className="font-semibold text-green-600">Double Down On</Text>
                </View>
                <View className="gap-2">
                  {recommendations.doubleDown.map((item, index) => (
                    <View key={index} className="flex-row items-start">
                      <View className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 mr-3" />
                      <Text variant="muted" className="text-sm flex-1">{item}</Text>
                    </View>
                  ))}
                </View>
              </CardContent>
            </Card>

            {/* Stop Doing */}
            <Card className="mb-4 border-red-500/30">
              <CardContent className="p-4">
                <View className="flex-row items-center mb-3">
                  <AlertTriangle size={20} className="text-red-500 mr-2" />
                  <Text className="font-semibold text-red-600">Stop Doing</Text>
                </View>
                <View className="gap-2">
                  {recommendations.stopDoing.map((item, index) => (
                    <View key={index} className="flex-row items-start">
                      <View className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 mr-3" />
                      <Text variant="muted" className="text-sm flex-1">{item}</Text>
                    </View>
                  ))}
                </View>
              </CardContent>
            </Card>

            {/* New Opportunities */}
            <Card className="mb-6 border-blue-500/30">
              <CardContent className="p-4">
                <View className="flex-row items-center mb-3">
                  <BarChart2 size={20} className="text-blue-500 mr-2" />
                  <Text className="font-semibold text-blue-600">New Opportunities</Text>
                </View>
                <View className="gap-2">
                  {recommendations.opportunities.map((item, index) => (
                    <View key={index} className="flex-row items-start">
                      <View className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-3" />
                      <Text variant="muted" className="text-sm flex-1">{item}</Text>
                    </View>
                  ))}
                </View>
              </CardContent>
            </Card>
          </>
        )}

        {/* Summary Card */}
        <Card className="bg-gradient-to-br from-primary/10 to-purple-500/10">
          <CardContent className="p-5">
            <Text className="font-semibold mb-2">Performance Summary</Text>
            <Text variant="muted" className="text-sm mb-4">
              Total views: {summary?.totalViews.toLocaleString() ?? 0} • 
              Shares: {summary?.totalShares ?? 0} • 
              Saves: {summary?.totalSaves ?? 0}
            </Text>
            <Pressable className="bg-primary px-4 py-3 rounded-xl active:opacity-80">
              <Text className="text-primary-foreground text-center font-semibold">Export Analytics Report</Text>
            </Pressable>
          </CardContent>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
