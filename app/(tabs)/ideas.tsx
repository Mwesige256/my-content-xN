import { useState } from "react";
import { SafeAreaView, ScrollView, Text, View, Card, CardContent, Pressable, Badge, Spinner } from "@/components/ui";
import { Sparkles, Filter, TrendingUp, MessageCircle, Share2, Star, ChevronRight, RefreshCw, Copy, Check, Wand2, Heart } from "lucide-react-native";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "expo-router";
import * as Clipboard from "expo-clipboard";

const contentTypes = [
  { id: "all", label: "All Ideas" },
  { id: "Educational", label: "Educational" },
  { id: "Storytelling", label: "Storytelling" },
  { id: "Controversial", label: "Controversial" },
  { id: "Tips", label: "Tips" },
  { id: "Mistakes", label: "Mistakes" },
  { id: "Behind-the-Scenes", label: "Behind-the-Scenes" },
  { id: "Secrets", label: "Secrets" },
];

export default function IdeasScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState("all");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generatingScriptId, setGeneratingScriptId] = useState<string | null>(null);
  
  const ideas = useQuery(api.ideas.getIdeas, { limit: 30 }) ?? [];
  const generateIdeas = useMutation(api.ideas.generateIdeas);
  const clearIdeas = useMutation(api.ideas.clearIdeas);
  const generateScript = useMutation(api.scripts.generateScript);
  const addFavorite = useMutation(api.favorites.addFavorite);
  const removeFavorite = useMutation(api.favorites.removeFavoriteByItemId);
  const favorites = useQuery(api.favorites.getFavorites, {}) ?? [];

  const filteredIdeas = selectedType === "all" 
    ? ideas 
    : ideas.filter(idea => idea.type === selectedType);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await clearIdeas();
      await generateIdeas();
    } catch (error) {
      console.error("Failed to generate ideas:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateScript = async (ideaId: string) => {
    setGeneratingScriptId(ideaId);
    try {
      await generateScript({ ideaId: ideaId as any });
      router.push("/scripts");
    } catch (error) {
      console.error("Failed to generate script:", error);
    } finally {
      setGeneratingScriptId(null);
    }
  };

  const copyIdea = async (title: string, id: string) => {
    await Clipboard.setStringAsync(title);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isFavorited = (ideaId: string) => {
    return favorites.some(f => f.itemId === ideaId);
  };

  const toggleFavorite = async (idea: any) => {
    if (isFavorited(idea._id)) {
      await removeFavorite({ itemId: idea._id });
    } else {
      await addFavorite({
        itemType: "idea",
        itemId: idea._id,
        title: idea.title,
      });
    }
  };

  const hasIdeas = ideas.length > 0;

  // Calculate average scores
  const avgScore = hasIdeas 
    ? (ideas.reduce((sum, idea) => sum + idea.totalScore, 0) / ideas.length).toFixed(1)
    : "0";
  
  const highScoringCount = ideas.filter(i => i.totalScore >= 8.0).length;

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerClassName="p-6 pb-24">
        {/* Header */}
        <View className="mb-6">
          <Text variant="muted" className="mb-1">Step 1 & 2</Text>
          <Text variant="h1" className="text-3xl">Content Ideas</Text>
          <Text variant="muted" className="mt-2">
            AI-generated ideas scored on virality, curiosity, value, and shareability.
          </Text>
        </View>

        {/* Stats Overview */}
        {hasIdeas && (
          <View className="flex-row gap-3 mb-6">
            <Card className="flex-1">
              <CardContent className="p-4">
                <Text className="text-2xl font-bold text-primary">{ideas.length}</Text>
                <Text variant="muted" className="text-xs">Total Ideas</Text>
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardContent className="p-4">
                <Text className="text-2xl font-bold text-primary">{avgScore}</Text>
                <Text variant="muted" className="text-xs">Avg Score</Text>
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardContent className="p-4">
                <Text className="text-2xl font-bold text-green-500">{highScoringCount}</Text>
                <Text variant="muted" className="text-xs">High Scorers</Text>
              </CardContent>
            </Card>
          </View>
        )}

        {/* Generate Button */}
        <Pressable 
          onPress={handleGenerate}
          disabled={isGenerating}
          className={`p-5 rounded-2xl mb-6 active:opacity-80 ${hasIdeas ? "bg-muted" : "bg-primary"}`}
        >
          <View className="flex-row items-center justify-center">
            {isGenerating ? (
              <Spinner className="text-primary-foreground mr-3" />
            ) : hasIdeas ? (
              <RefreshCw size={24} className="text-foreground mr-3" />
            ) : (
              <Sparkles size={24} className="text-primary-foreground mr-3" />
            )}
            <Text className={`text-lg font-semibold ${hasIdeas ? "text-foreground" : "text-primary-foreground"}`}>
              {isGenerating ? "Generating..." : hasIdeas ? "Regenerate Ideas" : "Generate 30 Content Ideas"}
            </Text>
          </View>
        </Pressable>

        {!hasIdeas && !isGenerating && (
          <Card className="mb-6 bg-muted/50">
            <CardContent className="p-5">
              <Text className="text-center text-muted-foreground">
                No ideas yet. Tap the button above to generate 30 AI-powered content ideas tailored to your brand.
              </Text>
            </CardContent>
          </Card>
        )}

        {hasIdeas && (
          <>
            {/* Filter Tabs */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
              <View className="flex-row gap-2">
                {contentTypes.map((type) => (
                  <Pressable
                    key={type.id}
                    onPress={() => setSelectedType(type.id)}
                    className={`px-4 py-2 rounded-full ${
                      selectedType === type.id ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <Text 
                      className={`text-sm font-medium ${
                        selectedType === type.id ? "text-primary-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {type.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>

            {/* Scoring Legend */}
            <Card className="bg-muted/50 mb-6">
              <CardContent className="p-4">
                <View className="flex-row items-center mb-3">
                  <Filter size={16} className="text-muted-foreground mr-2" />
                  <Text className="text-sm font-semibold">Scoring Criteria (1-10)</Text>
                </View>
                <View className="flex-row flex-wrap gap-4">
                  <View className="flex-row items-center">
                    <TrendingUp size={14} className="text-red-500 mr-1.5" />
                    <Text variant="muted" className="text-xs">Virality</Text>
                  </View>
                  <View className="flex-row items-center">
                    <MessageCircle size={14} className="text-blue-500 mr-1.5" />
                    <Text variant="muted" className="text-xs">Curiosity</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Star size={14} className="text-yellow-500 mr-1.5" />
                    <Text variant="muted" className="text-xs">Value</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Share2 size={14} className="text-green-500 mr-1.5" />
                    <Text variant="muted" className="text-xs">Shareability</Text>
                  </View>
                </View>
              </CardContent>
            </Card>

            {/* Ideas Count */}
            <View className="flex-row items-center justify-between mb-4">
              <Text variant="h3">
                {filteredIdeas.length} Ideas
                {selectedType !== "all" && ` (${selectedType})`}
              </Text>
              <Text variant="muted" className="text-xs">Sorted by score</Text>
            </View>

            {/* Ideas List */}
            <View className="gap-3">
              {filteredIdeas.map((idea, index) => (
                <Card key={idea._id} className="bg-card overflow-hidden">
                  <CardContent className="p-0">
                    <View className="p-4">
                      <View className="flex-row items-start justify-between mb-3">
                        <Badge variant="secondary" className="mb-2">
                          <Text className="text-xs">{idea.type}</Text>
                        </Badge>
                        <View className="flex-row items-center bg-primary/10 px-2.5 py-1 rounded-full">
                          <Star size={12} className="text-primary mr-1" />
                          <Text className="text-primary font-bold text-sm">{idea.totalScore.toFixed(1)}</Text>
                        </View>
                      </View>
                      
                      <View className="flex-row items-start justify-between">
                        <Text className="font-semibold text-base mb-3 flex-1 pr-2" numberOfLines={2}>
                          {idea.title}
                        </Text>
                        <View className="flex-row">
                          <Pressable 
                            onPress={() => toggleFavorite(idea)}
                            className="p-2 -mr-2 -mt-2"
                          >
                            <Heart 
                              size={18} 
                              className={isFavorited(idea._id) ? "text-red-500 fill-red-500" : "text-muted-foreground"} 
                            />
                          </Pressable>
                          <Pressable 
                            onPress={() => copyIdea(idea.title, idea._id)}
                            className="p-2 -mr-2 -mt-2"
                          >
                            {copiedId === idea._id ? (
                              <Check size={18} className="text-green-500" />
                            ) : (
                              <Copy size={18} className="text-muted-foreground" />
                            )}
                          </Pressable>
                        </View>
                      </View>
                      
                      <View className="flex-row gap-4">
                        <View className="flex-row items-center">
                          <View className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5" />
                          <Text variant="muted" className="text-xs">V: {idea.scores.virality}</Text>
                        </View>
                        <View className="flex-row items-center">
                          <View className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5" />
                          <Text variant="muted" className="text-xs">C: {idea.scores.curiosity}</Text>
                        </View>
                        <View className="flex-row items-center">
                          <View className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-1.5" />
                          <Text variant="muted" className="text-xs">Va: {idea.scores.value}</Text>
                        </View>
                        <View className="flex-row items-center">
                          <View className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5" />
                          <Text variant="muted" className="text-xs">S: {idea.scores.shareability}</Text>
                        </View>
                      </View>
                    </View>
                    
                    {/* Action Buttons */}
                    <View className="flex-row border-t border-border">
                      <Pressable 
                        onPress={() => handleGenerateScript(idea._id)}
                        disabled={generatingScriptId === idea._id}
                        className="flex-1 flex-row items-center justify-center py-3 bg-primary/5"
                      >
                        {generatingScriptId === idea._id ? (
                          <Spinner size="small" className="text-primary mr-2" />
                        ) : (
                          <Wand2 size={16} className="text-primary mr-2" />
                        )}
                        <Text className="text-primary text-sm font-medium">
                          {generatingScriptId === idea._id ? "Creating..." : "Create Script"}
                        </Text>
                      </Pressable>
                      
                      <View className="w-px bg-border" />
                      
                      <Pressable 
                        onPress={() => copyIdea(idea.title, idea._id)}
                        className="px-4 flex-row items-center justify-center"
                      >
                        {copiedId === idea._id ? (
                          <Check size={16} className="text-green-500" />
                        ) : (
                          <Copy size={16} className="text-muted-foreground" />
                        )}
                      </Pressable>
                    </View>
                  </CardContent>
                </Card>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
