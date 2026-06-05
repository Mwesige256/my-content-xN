import { SafeAreaView, ScrollView, Text, View, Card, CardContent, Pressable, Badge } from "@/components/ui";
import { Lightbulb, FileText, Calendar, BarChart3, Sparkles, TrendingUp, Zap, Target, ArrowRight, Plus, Wand2, Video } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const quickActions = [
  { icon: Lightbulb, label: "Generate Ideas", route: "/ideas", color: "bg-yellow-500/10", description: "30 AI-powered ideas" },
  { icon: FileText, label: "Write Scripts", route: "/scripts", color: "bg-blue-500/10", description: "Hooks, captions & assets" },
  { icon: Calendar, label: "Schedule", route: "/schedule", color: "bg-green-500/10", description: "Optimal posting times" },
  { icon: BarChart3, label: "Analytics", route: "/analytics", color: "bg-purple-500/10", description: "Track performance" },
];

export default function DashboardScreen() {
  const router = useRouter();
  
  const ideas = useQuery(api.ideas.getIdeas, { limit: 10 }) ?? [];
  const scripts = useQuery(api.scripts.getScripts) ?? [];
  const analytics = useQuery(api.analytics.getAnalyticsSummary);
  const brandConfig = useQuery(api.brand.getConfig);
  const generateIdeas = useMutation(api.ideas.generateIdeas);
  const clearIdeas = useMutation(api.ideas.clearIdeas);

  const topIdeas = ideas.slice(0, 3);
  const hasBrandConfig = !!brandConfig;
  const hasIdeas = ideas.length > 0;
  const hasScripts = scripts.length > 0;
  
  const stats = [
    { label: "Content Ideas", value: ideas.length.toString(), icon: Sparkles, trend: hasIdeas ? "Ready" : "-", color: "text-yellow-500" },
    { label: "Scripts Ready", value: scripts.length.toString(), icon: FileText, trend: hasScripts ? "Active" : "-", color: "text-blue-500" },
    { label: "Avg Watch Time", value: analytics ? `${analytics.avgWatchTime}s` : "-", icon: Zap, trend: analytics ? "Tracking" : "-", color: "text-green-500" },
    { label: "Engagement", value: analytics ? `${analytics.avgEngagement}%` : "-", icon: TrendingUp, trend: analytics ? "Live" : "-", color: "text-purple-500" },
  ];

  const quickGenerate = async () => {
    try {
      await clearIdeas();
      await generateIdeas();
      router.push("/ideas");
    } catch (error) {
      console.error("Failed to generate:", error);
    }
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerClassName="p-6 pb-24">
        {/* Header */}
        <View className="mb-6">
          <Text variant="muted" className="mb-1">AI Content Operating System</Text>
          <Text variant="h1" className="text-3xl">
            {brandConfig?.brandName ? `${brandConfig.brandName}` : "Content Dashboard"}
          </Text>
          <Text variant="muted" className="mt-2">
            Your complete content strategy, planning, and analytics hub.
          </Text>
        </View>

        {/* Quick Stats */}
        <View className="flex-row flex-wrap gap-3 mb-6">
          {stats.map((stat, index) => (
            <Card key={index} className="flex-1 min-w-[45%]">
              <CardContent className="p-4">
                <View className="flex-row items-center justify-between mb-2">
                  <stat.icon size={20} className={stat.color} />
                  <Text className="text-xs text-muted-foreground">{stat.trend}</Text>
                </View>
                <Text variant="h2" className="text-2xl">{stat.value}</Text>
                <Text variant="muted" className="text-xs">{stat.label}</Text>
              </CardContent>
            </Card>
          ))}
        </View>

        {/* Quick Actions */}
        <Text variant="h3" className="mb-4">Quick Actions</Text>
        <View className="flex-row flex-wrap gap-3 mb-6">
          {quickActions.map((action, index) => (
            <Pressable
              key={index}
              onPress={() => router.push(action.route as any)}
              className="flex-1 min-w-[45%]"
            >
              <Card className="bg-card h-full">
                <CardContent className={`p-4 ${action.color} rounded-xl h-full`}>
                  <action.icon size={28} className="text-foreground mb-3" />
                  <Text className="font-semibold text-sm">{action.label}</Text>
                  <Text variant="muted" className="text-xs mt-1">{action.description}</Text>
                </CardContent>
              </Card>
            </Pressable>
          ))}
        </View>

        {/* Quick Generate Button */}
        {!hasIdeas && hasBrandConfig && (
          <Pressable 
            onPress={quickGenerate}
            className="bg-primary p-5 rounded-2xl mb-6 active:opacity-80"
          >
            <View className="flex-row items-center justify-center">
              <Wand2 size={24} className="text-primary-foreground mr-3" />
              <Text className="text-primary-foreground text-lg font-semibold">
                Generate Your First 30 Ideas
              </Text>
            </View>
          </Pressable>
        )}

        {/* Top Scoring Ideas */}
        {topIdeas.length > 0 && (
          <>
            <View className="flex-row items-center justify-between mb-4">
              <Text variant="h3">Top Scoring Ideas</Text>
              <Pressable onPress={() => router.push("/ideas")} className="flex-row items-center">
                <Text className="text-primary text-sm font-medium mr-1">View All</Text>
                <ArrowRight size={16} className="text-primary" />
              </Pressable>
            </View>
            <View className="gap-3 mb-6">
              {topIdeas.map((idea) => (
                <Card key={idea._id} className="bg-card">
                  <CardContent className="p-4 flex-row items-center justify-between">
                    <View className="flex-1 pr-4">
                      <Text className="font-semibold text-sm mb-1" numberOfLines={2}>{idea.title}</Text>
                      <Text variant="muted" className="text-xs">{idea.type}</Text>
                    </View>
                    <View className="bg-primary/10 px-3 py-1.5 rounded-full">
                      <Text className="text-primary font-bold text-sm">{idea.totalScore.toFixed(1)}</Text>
                    </View>
                  </CardContent>
                </Card>
              ))}
            </View>
          </>
        )}

        {/* Faceless Generator Promo */}
        <Card className="mb-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardContent className="p-5">
            <View className="flex-row items-center mb-3">
              <Sparkles size={24} className="text-purple-500 mr-2" />
              <Text variant="h3" className="text-lg">New: AI Faceless Generator</Text>
            </View>
            <Text variant="muted" className="text-sm mb-4">
              Create viral faceless content with Llama AI. Generate scripts, visual directions, and voiceover guides without showing your face.
            </Text>
            <Pressable 
              onPress={() => router.push("/faceless")}
              className="bg-purple-500 px-4 py-3 rounded-xl active:opacity-80"
            >
              <View className="flex-row items-center justify-center">
                <Wand2 size={18} className="text-white mr-2" />
                <Text className="text-white text-center font-semibold">Try Faceless Generator</Text>
              </View>
            </Pressable>
          </CardContent>
        </Card>

        {/* Brand Status Card */}
        <Card className={`mb-6 ${hasBrandConfig ? "bg-green-500/5 border-green-500/20" : "bg-gradient-to-br from-primary/10 to-purple-500/10"}`}>
          <CardContent className="p-5">
            <View className="flex-row items-center mb-3">
              <Target size={24} className={hasBrandConfig ? "text-green-500 mr-2" : "text-primary mr-2"} />
              <Text variant="h3" className="text-lg">
                {hasBrandConfig ? "Brand Configured ✓" : "Setup Required"}
              </Text>
            </View>
            
            {hasBrandConfig ? (
              <>
                <View className="flex-row flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">
                    <Text className="text-xs">{brandConfig.industry}</Text>
                  </Badge>
                  {brandConfig.platforms.slice(0, 3).map((platform) => (
                    <Badge key={platform} variant="outline">
                      <Text className="text-xs">{platform}</Text>
                    </Badge>
                  ))}
                </View>
                <Pressable 
                  onPress={() => router.push("/brand-setup")}
                  className="bg-muted px-4 py-3 rounded-xl active:opacity-80"
                >
                  <Text className="text-foreground text-center font-semibold">Edit Configuration</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Text variant="muted" className="text-sm mb-4">
                  Set up your brand details to generate personalized content strategies, scripts, and schedules.
                </Text>
                <Pressable 
                  onPress={() => router.push("/brand-setup")}
                  className="bg-primary px-4 py-3 rounded-xl active:opacity-80"
                >
                  <Text className="text-primary-foreground text-center font-semibold">Configure Brand</Text>
                </Pressable>
              </>
            )}
          </CardContent>
        </Card>

        {/* Recent Scripts */}
        {scripts.length > 0 && (
          <>
            <View className="flex-row items-center justify-between mb-4">
              <Text variant="h3">Recent Scripts</Text>
              <Pressable onPress={() => router.push("/scripts")} className="flex-row items-center">
                <Text className="text-primary text-sm font-medium mr-1">View All</Text>
                <ArrowRight size={16} className="text-primary" />
              </Pressable>
            </View>
            <View className="gap-3 mb-6">
              {scripts.slice(0, 2).map((script) => (
                <Card key={script._id} className="bg-card">
                  <CardContent className="p-4">
                    <Text className="font-semibold text-sm mb-2" numberOfLines={1}>{script.title}</Text>
                    <Text variant="muted" className="text-xs" numberOfLines={2}>
                      "{script.hook}"
                    </Text>
                  </CardContent>
                </Card>
              ))}
            </View>
          </>
        )}

        {/* System Overview */}
        <Text variant="h3" className="mb-4">System Capabilities</Text>
        <View className="gap-2">
          {[
            "Generate 30 scored content ideas instantly",
            "Auto-create hooks, scripts & CTAs",
            "Platform-specific optimizations",
            "AI production assets (prompts, B-roll)",
            "Smart posting schedule",
            "Performance analytics & recommendations",
          ].map((capability, index) => (
            <View key={index} className="flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-primary mr-3" />
              <Text variant="muted" className="text-sm">{capability}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
