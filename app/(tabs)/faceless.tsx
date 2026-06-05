import { useState } from "react";
import { SafeAreaView, ScrollView, Text, View, Card, CardContent, Pressable, Badge, Input, Spinner } from "@/components/ui";
import { Wand2, Sparkles, Video, Mic, Image as ImageIcon, Copy, Check, RefreshCw, Play, BookOpen, List, Newspaper } from "lucide-react-native";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import * as Clipboard from "expo-clipboard";

const platforms = [
  { id: "tiktok", label: "TikTok", icon: Video },
  { id: "youtube", label: "YouTube Shorts", icon: Play },
  { id: "instagram", label: "Instagram Reels", icon: ImageIcon },
];

const durations = [
  { id: "short", label: "Short", time: "15-30s", words: "50-80 words" },
  { id: "medium", label: "Medium", time: "30-60s", words: "100-150 words" },
  { id: "long", label: "Long", time: "60-90s", words: "150-200 words" },
];

const styles = [
  { id: "educational", label: "Educational", icon: BookOpen, desc: "Teach something valuable" },
  { id: "storytelling", label: "Storytelling", icon: Mic, desc: "Share experiences" },
  { id: "listicle", label: "Listicle", icon: List, desc: "Top 5, Tips, Mistakes" },
  { id: "news", label: "News/Update", icon: Newspaper, desc: "Industry updates" },
];

export default function FacelessContentScreen() {
  const [topic, setTopic] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("tiktok");
  const [selectedDuration, setSelectedDuration] = useState("short");
  const [selectedStyle, setSelectedStyle] = useState("educational");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("script");

  const generateFacelessScript = useAction(api.ai.generateFacelessScript);
  const saveAIGeneration = useMutation(api.aiData.saveAIGeneration);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    try {
      const result = await generateFacelessScript({
        topic: topic.trim(),
        platform: selectedPlatform,
        duration: selectedDuration,
        style: selectedStyle,
      });
      
      setGeneratedContent(result);
      
      await saveAIGeneration({
        promptType: "faceless_script",
        prompt: topic,
        result: JSON.stringify(result),
        model: "meta-llama/llama-3.1-70b-instruct",
      });
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (field: string, text: string) => {
    await Clipboard.setStringAsync(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const tabs = [
    { id: "script", label: "Script", icon: BookOpen },
    { id: "visuals", label: "Visuals", icon: ImageIcon },
    { id: "voice", label: "Voice", icon: Mic },
  ];

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerClassName="p-6 pb-24">
        {/* Header */}
        <View className="mb-6">
          <View className="flex-row items-center mb-2">
            <Sparkles size={24} className="text-primary mr-2" />
            <Text variant="muted">AI-Powered (Llama 3.1)</Text>
          </View>
          <Text variant="h1" className="text-3xl">Faceless Generator</Text>
          <Text variant="muted" className="mt-2">
            Create AI-generated content without showing your face. Perfect for voiceover, AI avatars, and text-overlay videos.
          </Text>
        </View>

        {/* Topic Input */}
        <Card className="mb-6">
          <CardContent className="p-5">
            <Text className="font-semibold mb-3">What is your video about?</Text>
            <Input
              placeholder="e.g., 5 productivity hacks for entrepreneurs..."
              value={topic}
              onChangeText={setTopic}
              multiline
              numberOfLines={2}
              className="mb-4"
            />
            
            <Pressable
              onPress={handleGenerate}
              disabled={!topic.trim() || isGenerating}
              className={`p-4 rounded-xl flex-row items-center justify-center ${
                !topic.trim() || isGenerating ? "bg-muted" : "bg-primary"
              }`}
            >
              {isGenerating ? (
                <>
                  <Spinner className="text-primary-foreground mr-2" />
                  <Text className="text-primary-foreground font-semibold">Generating with Llama AI...</Text>
                </>
              ) : (
                <>
                  <Wand2 size={20} className="text-primary-foreground mr-2" />
                  <Text className="text-primary-foreground font-semibold">Generate Faceless Script</Text>
                </>
              )}
            </Pressable>
          </CardContent>
        </Card>

        {/* Platform Selection */}
        <Text className="font-semibold mb-3">Platform</Text>
        <View className="flex-row gap-2 mb-6">
          {platforms.map((platform) => (
            <Pressable
              key={platform.id}
              onPress={() => setSelectedPlatform(platform.id)}
              className={`flex-1 p-3 rounded-xl flex-row items-center justify-center ${
                selectedPlatform === platform.id ? "bg-primary" : "bg-muted"
              }`}
            >
              <platform.icon size={18} className={selectedPlatform === platform.id ? "text-primary-foreground mr-2" : "text-muted-foreground mr-2"} />
              <Text className={selectedPlatform === platform.id ? "text-primary-foreground font-medium text-sm" : "text-muted-foreground font-medium text-sm"}>
                {platform.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Duration */}
        <Text className="font-semibold mb-3">Duration</Text>
        <View className="flex-row gap-2 mb-6">
          {durations.map((duration) => (
            <Pressable
              key={duration.id}
              onPress={() => setSelectedDuration(duration.id)}
              className={`flex-1 p-3 rounded-xl ${
                selectedDuration === duration.id ? "bg-primary" : "bg-muted"
              }`}
            >
              <Text className={`font-semibold text-center ${selectedDuration === duration.id ? "text-primary-foreground" : "text-foreground"}`}>
                {duration.label}
              </Text>
              <Text className={`text-xs text-center mt-1 ${selectedDuration === duration.id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {duration.time}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Content Style */}
        <Text className="font-semibold mb-3">Content Style</Text>
        <View className="flex-row flex-wrap gap-2 mb-6">
          {styles.map((style) => (
            <Pressable
              key={style.id}
              onPress={() => setSelectedStyle(style.id)}
              className={`flex-1 min-w-[45%] p-3 rounded-xl ${
                selectedStyle === style.id ? "bg-primary" : "bg-muted"
              }`}
            >
              <View className="flex-row items-center mb-1">
                <style.icon size={16} className={selectedStyle === style.id ? "text-primary-foreground mr-2" : "text-muted-foreground mr-2"} />
                <Text className={`font-medium ${selectedStyle === style.id ? "text-primary-foreground" : "text-foreground"}`}>
                  {style.label}
                </Text>
              </View>
              <Text className={`text-xs ${selectedStyle === style.id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {style.desc}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Generated Content */}
        {generatedContent && (
          <>
            <View className="flex-row items-center justify-between mb-4">
              <Text variant="h3">Generated Content</Text>
              <Pressable 
                onPress={handleGenerate}
                disabled={isGenerating}
                className="flex-row items-center"
              >
                <RefreshCw size={16} className="text-primary mr-1" />
                <Text className="text-primary text-sm">Regenerate</Text>
              </Pressable>
            </View>

            {/* Tabs */}
            <View className="flex-row gap-2 mb-4">
              {tabs.map((tab) => (
                <Pressable
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id)}
                  className={`flex-1 flex-row items-center justify-center py-2 rounded-lg ${
                    activeTab === tab.id ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <tab.icon size={16} className={activeTab === tab.id ? "text-primary-foreground mr-2" : "text-muted-foreground mr-2"} />
                  <Text className={activeTab === tab.id ? "text-primary-foreground font-medium" : "text-muted-foreground font-medium"}>
                    {tab.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Script Tab */}
            {activeTab === "script" && (
              <View className="gap-4">
                <Card>
                  <CardContent className="p-4">
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="font-semibold text-sm">Title</Text>
                      <Pressable onPress={() => copyToClipboard("title", generatedContent.title)}>
                        {copiedField === "title" ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-muted-foreground" />}
                      </Pressable>
                    </View>
                    <Text className="text-lg font-bold">{generatedContent.title}</Text>
                  </CardContent>
                </Card>

                <Card className="bg-red-500/5 border-red-500/20">
                  <CardContent className="p-4">
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="font-semibold text-sm text-red-500">Hook</Text>
                      <Pressable onPress={() => copyToClipboard("hook", generatedContent.hook)}>
                        {copiedField === "hook" ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-muted-foreground" />}
                      </Pressable>
                    </View>
                    <Text className="text-lg font-medium">"{generatedContent.hook}"</Text>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="font-semibold text-sm">Full Script</Text>
                      <Pressable onPress={() => copyToClipboard("script", generatedContent.script)}>
                        {copiedField === "script" ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-muted-foreground" />}
                      </Pressable>
                    </View>
                    <Text className="leading-relaxed">{generatedContent.script}</Text>
                  </CardContent>
                </Card>

                <Card className="bg-primary/5">
                  <CardContent className="p-4">
                    <Text className="font-semibold text-sm mb-2">CTA</Text>
                    <Text>{generatedContent.cta}</Text>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <Text className="font-semibold text-sm mb-2">Hashtags</Text>
                    <View className="flex-row flex-wrap gap-2">
                      {generatedContent.hashtags.split(" ").map((tag: string, i: number) => (
                        <Badge key={i} variant="secondary">
                          <Text className="text-xs">{tag}</Text>
                        </Badge>
                      ))}
                    </View>
                  </CardContent>
                </Card>
              </View>
            )}

            {/* Visuals Tab */}
            {activeTab === "visuals" && (
              <View className="gap-4">
                <Card>
                  <CardContent className="p-4">
                    <Text className="font-semibold mb-3">Visual Directions</Text>
                    <Text className="leading-relaxed">{generatedContent.visualDirections}</Text>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <Text className="font-semibold mb-3">B-Roll Suggestions</Text>
                    <View className="gap-2">
                      {generatedContent.brollSuggestions.map((suggestion: string, index: number) => (
                        <View key={index} className="flex-row items-start">
                          <Text className="text-muted-foreground mr-2">{index + 1}.</Text>
                          <Text className="flex-1">{suggestion}</Text>
                        </View>
                      ))}
                    </View>
                  </CardContent>
                </Card>

                <Card className="bg-purple-500/5">
                  <CardContent className="p-4">
                    <Text className="font-semibold mb-2">Avatar Type</Text>
                    <Text>{generatedContent.avatarType}</Text>
                  </CardContent>
                </Card>
              </View>
            )}

            {/* Voice Tab */}
            {activeTab === "voice" && (
              <Card>
                <CardContent className="p-4">
                  <Text className="font-semibold mb-3">Voiceover Style Guide</Text>
                  <Text className="leading-relaxed">{generatedContent.voiceoverStyle}</Text>
                  
                  <View className="mt-4 p-3 bg-muted rounded-lg">
                    <Text className="text-sm font-medium mb-1">AI Voice Tools:</Text>
                    <Text className="text-sm text-muted-foreground">
                      ElevenLabs, Murf.ai, or Play.ht for natural AI voices
                    </Text>
                  </View>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
