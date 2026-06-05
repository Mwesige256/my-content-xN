import { useState, useEffect } from "react";
import { Pressable } from "react-native";
import { SafeAreaView, ScrollView, Text, View, Card, CardContent, Input, Button } from "@/components/ui";
import { TextInput } from "react-native";
import { ArrowLeft, Building2, Users, Target, MessageSquare, Share2, Check, Save } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const platforms = [
  { id: "tiktok", label: "TikTok", selected: true },
  { id: "youtube", label: "YouTube Shorts", selected: true },
  { id: "instagram", label: "Instagram Reels", selected: true },
  { id: "facebook", label: "Facebook", selected: false },
  { id: "linkedin", label: "LinkedIn", selected: false },
  { id: "x", label: "X (Twitter)", selected: false },
];

const tones = [
  { id: "bold", label: "Bold", selected: true },
  { id: "intelligent", label: "Intelligent", selected: true },
  { id: "human", label: "Human", selected: true },
  { id: "memorable", label: "Memorable", selected: true },
  { id: "action", label: "Action-oriented", selected: true },
];

export default function BrandSetupScreen() {
  const router = useRouter();
  const existingConfig = useQuery(api.brand.getConfig);
  const saveConfig = useMutation(api.brand.saveConfig);
  
  const [isSaving, setIsSaving] = useState(false);
  const [selectedTones, setSelectedTones] = useState<string[]>(["bold", "intelligent", "human", "memorable", "action"]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["tiktok", "youtube", "instagram"]);
  const [formData, setFormData] = useState({
    brandName: "",
    industry: "",
    targetAudience: "",
    mission: "",
  });

  // Load existing config when available
  useEffect(() => {
    if (existingConfig) {
      setFormData({
        brandName: existingConfig.brandName,
        industry: existingConfig.industry,
        targetAudience: existingConfig.targetAudience,
        mission: existingConfig.mission,
      });
      setSelectedTones(existingConfig.tones);
      setSelectedPlatforms(existingConfig.platforms);
    }
  }, [existingConfig]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveConfig({
        brandName: formData.brandName,
        industry: formData.industry,
        targetAudience: formData.targetAudience,
        mission: formData.mission,
        tones: selectedTones,
        platforms: selectedPlatforms,
      });
      router.back();
    } catch (error) {
      console.error("Failed to save config:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleTone = (toneId: string) => {
    setSelectedTones(prev => 
      prev.includes(toneId) 
        ? prev.filter(t => t !== toneId)
        : [...prev, toneId]
    );
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerClassName="p-6 pb-24">
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <Button variant="ghost" size="icon" onPress={() => router.back()} className="mr-2">
            <ArrowLeft size={24} className="text-foreground" />
          </Button>
          <View>
            <Text variant="h1" className="text-2xl">Brand Setup</Text>
            <Text variant="muted" className="text-sm">Configure your content strategy</Text>
          </View>
        </View>

        {/* Brand Info */}
        <Card className="mb-6">
          <CardContent className="p-5">
            <View className="flex-row items-center mb-4">
              <Building2 size={20} className="text-primary mr-2" />
              <Text className="font-semibold text-lg">Brand Information</Text>
            </View>
            
            <View className="gap-4">
              <View>
                <Text className="text-sm font-medium mb-2">Brand Name</Text>
                <Input
                  placeholder="Enter your brand name"
                  value={formData.brandName}
                  onChangeText={(text: string) => setFormData({ ...formData, brandName: text })}
                />
              </View>
              
              <View>
                <Text className="text-sm font-medium mb-2">Industry</Text>
                <Input
                  placeholder="e.g., SaaS, Fitness, E-commerce"
                  value={formData.industry}
                  onChangeText={(text: string) => setFormData({ ...formData, industry: text })}
                />
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Target Audience */}
        <Card className="mb-6">
          <CardContent className="p-5">
            <View className="flex-row items-center mb-4">
              <Users size={20} className="text-primary mr-2" />
              <Text className="font-semibold text-lg">Target Audience</Text>
            </View>
            
            <View>
              <Text className="text-sm font-medium mb-2">Describe Your Audience</Text>
              <TextInput
                placeholder="e.g., Small business owners aged 25-40 who struggle with social media marketing..."
                value={formData.targetAudience}
                onChangeText={(text: string) => setFormData({ ...formData, targetAudience: text })}
                multiline
                numberOfLines={4}
                className="border border-input bg-background px-3 py-2 rounded-md text-foreground"
                style={{ textAlignVertical: 'top', minHeight: 80 }}
              />
            </View>
          </CardContent>
        </Card>

        {/* Mission */}
        <Card className="mb-6">
          <CardContent className="p-5">
            <View className="flex-row items-center mb-4">
              <Target size={20} className="text-primary mr-2" />
              <Text className="font-semibold text-lg">Mission</Text>
            </View>
            
            <View>
              <Text className="text-sm font-medium mb-2">Brand Mission</Text>
              <TextInput
                placeholder="What change are you creating in the world?"
                value={formData.mission}
                onChangeText={(text: string) => setFormData({ ...formData, mission: text })}
                multiline
                numberOfLines={3}
                className="border border-input bg-background px-3 py-2 rounded-md text-foreground"
                style={{ textAlignVertical: 'top', minHeight: 60 }}
              />
            </View>
          </CardContent>
        </Card>

        {/* Tone */}
        <Card className="mb-6">
          <CardContent className="p-5">
            <View className="flex-row items-center mb-4">
              <MessageSquare size={20} className="text-primary mr-2" />
              <Text className="font-semibold text-lg">Brand Tone</Text>
            </View>
            
            <View className="flex-row flex-wrap gap-2">
              {tones.map((tone) => (
                <Pressable
                  key={tone.id}
                  onPress={() => toggleTone(tone.id)}
                  className={`px-4 py-2 rounded-full flex-row items-center ${
                    selectedTones.includes(tone.id) ? "bg-primary" : "bg-muted"
                  }`}
                >
                  {selectedTones.includes(tone.id) && <Check size={14} className="text-primary-foreground mr-1.5" />}
                  <Text className={selectedTones.includes(tone.id) ? "text-primary-foreground" : "text-muted-foreground"}>
                    {tone.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </CardContent>
        </Card>

        {/* Platforms */}
        <Card className="mb-6">
          <CardContent className="p-5">
            <View className="flex-row items-center mb-4">
              <Share2 size={20} className="text-primary mr-2" />
              <Text className="font-semibold text-lg">Platforms</Text>
            </View>
            
            <View className="flex-row flex-wrap gap-2">
              {platforms.map((platform) => (
                <Pressable
                  key={platform.id}
                  onPress={() => togglePlatform(platform.id)}
                  className={`px-4 py-2 rounded-full flex-row items-center ${
                    selectedPlatforms.includes(platform.id) ? "bg-primary" : "bg-muted"
                  }`}
                >
                  {selectedPlatforms.includes(platform.id) && <Check size={14} className="text-primary-foreground mr-1.5" />}
                  <Text className={selectedPlatforms.includes(platform.id) ? "text-primary-foreground" : "text-muted-foreground"}>
                    {platform.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button 
          className="w-full py-4"
          onPress={handleSave}
          disabled={isSaving}
        >
          <View className="flex-row items-center justify-center">
            {isSaving ? (
              <>
                <Save size={18} className="text-primary-foreground mr-2" />
                <Text className="text-primary-foreground font-semibold">Saving...</Text>
              </>
            ) : (
              <Text className="text-primary-foreground font-semibold">Save Brand Configuration</Text>
            )}
          </View>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
