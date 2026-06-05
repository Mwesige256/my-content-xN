import { useState } from "react";
import { SafeAreaView, ScrollView, Text, View, Card, CardContent, Pressable, Badge, Input } from "@/components/ui";
import { Heart, Trash2, Lightbulb, FileText, Plus, X, MessageSquare, Bookmark } from "lucide-react-native";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "expo-router";

const tabs = [
  { id: "all", label: "All", icon: Bookmark },
  { id: "idea", label: "Ideas", icon: Lightbulb },
  { id: "script", label: "Scripts", icon: FileText },
];

export default function FavoritesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  
  const favorites = useQuery(api.favorites.getFavorites, { 
    itemType: activeTab === "all" ? undefined : activeTab 
  }) ?? [];
  const favoriteCount = useQuery(api.favorites.getFavoriteCount);
  const removeFavorite = useMutation(api.favorites.removeFavorite);
  const updateNote = useMutation(api.favorites.updateNote);

  const handleRemove = async (favoriteId: string) => {
    await removeFavorite({ favoriteId: favoriteId as any });
  };

  const startEditingNote = (favorite: any) => {
    setEditingNote(favorite._id);
    setNoteText(favorite.note || "");
  };

  const saveNote = async (favoriteId: string) => {
    await updateNote({ favoriteId: favoriteId as any, note: noteText });
    setEditingNote(null);
    setNoteText("");
  };

  const cancelEditing = () => {
    setEditingNote(null);
    setNoteText("");
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerClassName="p-6 pb-24">
        {/* Header */}
        <View className="mb-6">
          <Text variant="muted" className="mb-1">Your Library</Text>
          <Text variant="h1" className="text-3xl">Saved Items</Text>
          <Text variant="muted" className="mt-2">
            Bookmark your favorite ideas and scripts for quick access.
          </Text>
        </View>

        {/* Stats */}
        {favoriteCount && (
          <View className="flex-row gap-3 mb-6">
            <Card className="flex-1">
              <CardContent className="p-4">
                <Text className="text-2xl font-bold text-primary">{favoriteCount.total}</Text>
                <Text variant="muted" className="text-xs">Total Saved</Text>
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardContent className="p-4">
                <Text className="text-2xl font-bold text-yellow-500">{favoriteCount.ideas}</Text>
                <Text variant="muted" className="text-xs">Ideas</Text>
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardContent className="p-4">
                <Text className="text-2xl font-bold text-blue-500">{favoriteCount.scripts}</Text>
                <Text variant="muted" className="text-xs">Scripts</Text>
              </CardContent>
            </Card>
          </View>
        )}

        {/* Filter Tabs */}
        <View className="flex-row gap-2 mb-6">
          {tabs.map((tab) => (
            <Pressable
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              className={`flex-1 flex-row items-center justify-center py-3 rounded-xl ${
                activeTab === tab.id ? "bg-primary" : "bg-muted"
              }`}
            >
              <tab.icon size={18} className={activeTab === tab.id ? "text-primary-foreground mr-2" : "text-muted-foreground mr-2"} />
              <Text className={activeTab === tab.id ? "text-primary-foreground font-semibold" : "text-muted-foreground font-semibold"}>
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Empty State */}
        {favorites.length === 0 && (
          <Card className="bg-muted/50 mb-6">
            <CardContent className="p-8 items-center">
              <Heart size={48} className="text-muted-foreground mb-4" />
              <Text className="text-center font-semibold mb-2">No saved items yet</Text>
              <Text className="text-center text-muted-foreground text-sm mb-4">
                Tap the heart icon on ideas or scripts to save them here.
              </Text>
              <View className="flex-row gap-3">
                <Pressable 
                  onPress={() => router.push("/ideas")}
                  className="bg-primary px-4 py-2 rounded-lg"
                >
                  <Text className="text-primary-foreground font-medium">Browse Ideas</Text>
                </Pressable>
                <Pressable 
                  onPress={() => router.push("/scripts")}
                  className="bg-muted px-4 py-2 rounded-lg"
                >
                  <Text className="text-foreground font-medium">View Scripts</Text>
                </Pressable>
              </View>
            </CardContent>
          </Card>
        )}

        {/* Favorites List */}
        <View className="gap-3">
          {favorites.map((favorite) => (
            <Card key={favorite._id} className="bg-card overflow-hidden">
              <CardContent className="p-4">
                {/* Header */}
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-row items-center">
                    {favorite.itemType === "idea" ? (
                      <Lightbulb size={18} className="text-yellow-500 mr-2" />
                    ) : (
                      <FileText size={18} className="text-blue-500 mr-2" />
                    )}
                    <Badge variant="secondary">
                      <Text className="text-xs capitalize">{favorite.itemType}</Text>
                    </Badge>
                  </View>
                  <Pressable onPress={() => handleRemove(favorite._id)}>
                    <Trash2 size={18} className="text-red-500" />
                  </Pressable>
                </View>

                {/* Title */}
                <Text className="font-semibold text-base mb-3" numberOfLines={2}>
                  {favorite.title}
                </Text>

                {/* Note */}
                {editingNote === favorite._id ? (
                  <View className="bg-muted p-3 rounded-lg">
                    <Input
                      placeholder="Add a note..."
                      value={noteText}
                      onChangeText={setNoteText}
                      multiline
                      numberOfLines={2}
                      className="mb-2"
                    />
                    <View className="flex-row gap-2">
                      <Pressable 
                        onPress={() => saveNote(favorite._id)}
                        className="flex-1 bg-primary py-2 rounded-lg items-center"
                      >
                        <Text className="text-primary-foreground font-medium text-sm">Save</Text>
                      </Pressable>
                      <Pressable 
                        onPress={cancelEditing}
                        className="flex-1 bg-muted py-2 rounded-lg items-center"
                      >
                        <Text className="text-foreground font-medium text-sm">Cancel</Text>
                      </Pressable>
                    </View>
                  </View>
                ) : favorite.note ? (
                  <View className="bg-muted/50 p-3 rounded-lg mb-2">
                    <View className="flex-row items-start">
                      <MessageSquare size={14} className="text-muted-foreground mr-2 mt-0.5" />
                      <Text variant="muted" className="text-sm flex-1">{favorite.note}</Text>
                    </View>
                    <Pressable 
                      onPress={() => startEditingNote(favorite)}
                      className="mt-2"
                    >
                      <Text className="text-primary text-xs">Edit Note</Text>
                    </Pressable>
                  </View>
                ) : (
                  <Pressable 
                    onPress={() => startEditingNote(favorite)}
                    className="flex-row items-center"
                  >
                    <Plus size={16} className="text-muted-foreground mr-1" />
                    <Text className="text-muted-foreground text-sm">Add Note</Text>
                  </Pressable>
                )}

                {/* Date */}
                <Text variant="muted" className="text-xs mt-3">
                  Saved {new Date(favorite.createdAt).toLocaleDateString()}
                </Text>
              </CardContent>
            </Card>
          ))}
        </View>

        {/* Quick Tip */}
        <Card className="mt-6 bg-primary/5 border-primary/20">
          <CardContent className="p-5">
            <Text className="font-semibold mb-2">💡 Pro Tip</Text>
            <Text variant="muted" className="text-sm">
              Use saved items to build a content backlog. When you're ready to create, your best ideas are just a tap away.
            </Text>
          </CardContent>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
