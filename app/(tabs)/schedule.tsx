import { useState } from "react";
import { SafeAreaView, ScrollView, Text, View, Card, CardContent, Pressable, Badge, Switch, Button, Sheet } from "@/components/ui";
import { Clock, Sun, Sunset, Moon, CalendarDays, ChevronLeft, ChevronRight, Plus, Trash2, CheckCircle, AlertCircle } from "lucide-react-native";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const timeSlots = [
  { id: "morning", label: "Morning", icon: Sun, time: "8:00 AM", optimal: true },
  { id: "afternoon", label: "Afternoon", icon: Clock, time: "1:00 PM", optimal: true },
  { id: "evening", label: "Evening", icon: Sunset, time: "7:00 PM", optimal: false },
];

const contentMixPercentages = [
  { type: "Educational", percentage: 25, color: "bg-blue-500" },
  { type: "Tips & Tricks", percentage: 25, color: "bg-green-500" },
  { type: "Storytelling", percentage: 20, color: "bg-purple-500" },
  { type: "Behind-the-Scenes", percentage: 15, color: "bg-orange-500" },
  { type: "Controversial/Opinion", percentage: 10, color: "bg-red-500" },
  { type: "Motivational", percentage: 5, color: "bg-yellow-500" },
];

export default function ScheduleScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showScheduleSheet, setShowScheduleSheet] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
  const scripts = useQuery(api.scripts.getScripts) ?? [];
  const scheduledPosts = useQuery(api.schedule.getScheduledPosts, {}) ?? [];
  const schedulePost = useMutation(api.schedule.schedulePost);
  const deletePost = useMutation(api.schedule.deletePost);

  // Calendar logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };

  const getPostsForDate = (day: number) => {
    const dateStr = new Date(year, month, day).toDateString();
    return scheduledPosts.filter(post => 
      new Date(post.scheduledDate).toDateString() === dateStr
    );
  };

  const hasPosts = (day: number) => getPostsForDate(day).length > 0;

  const handleDateSelect = (day: number) => {
    setSelectedDate(new Date(year, month, day));
    setShowScheduleSheet(true);
  };

  const handleSchedule = async (scriptId: string, platform: string, time: string) => {
    if (!selectedDate) return;
    
    const scheduledDate = new Date(selectedDate);
    const [hours, minutes] = time.split(':');
    const isPM = time.includes('PM');
    let hour = parseInt(hours);
    if (isPM && hour !== 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;
    
    scheduledDate.setHours(hour, parseInt(minutes), 0, 0);
    
    await schedulePost({
      scriptId: scriptId as any,
      platform,
      scheduledDate: scheduledDate.getTime(),
      scheduledTime: time,
    });
    
    setShowScheduleSheet(false);
  };

  const handleDelete = async (postId: string) => {
    await deletePost({ postId: postId as any });
  };

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerClassName="p-6 pb-24">
        {/* Header */}
        <View className="mb-6">
          <Text variant="muted" className="mb-1">Step 6</Text>
          <Text variant="h1" className="text-3xl">Content Calendar</Text>
          <Text variant="muted" className="mt-2">
            Schedule and visualize your content pipeline.
          </Text>
        </View>

        {/* Calendar Card */}
        <Card className="mb-6">
          <CardContent className="p-5">
            {/* Calendar Header */}
            <View className="flex-row items-center justify-between mb-4">
              <Pressable onPress={prevMonth} className="p-2">
                <ChevronLeft size={24} className="text-foreground" />
              </Pressable>
              <Text className="text-lg font-semibold">
                {months[month]} {year}
              </Text>
              <Pressable onPress={nextMonth} className="p-2">
                <ChevronRight size={24} className="text-foreground" />
              </Pressable>
            </View>

            {/* Week Days */}
            <View className="flex-row mb-2">
              {weekDays.map(day => (
                <View key={day} className="flex-1 items-center py-2">
                  <Text variant="muted" className="text-xs font-medium">{day}</Text>
                </View>
              ))}
            </View>

            {/* Calendar Grid */}
            <View className="flex-row flex-wrap">
              {calendarDays.map((day, index) => {
                const isToday = day && 
                  today.getDate() === day && 
                  today.getMonth() === month && 
                  today.getFullYear() === year;
                const isSelected = selectedDate && 
                  selectedDate.getDate() === day && 
                  selectedDate.getMonth() === month;
                const dayHasPosts = day && hasPosts(day);

                return (
                  <Pressable
                    key={index}
                    onPress={() => day && handleDateSelect(day)}
                    className="w-[14.28%] aspect-square items-center justify-center"
                    disabled={!day}
                  >
                    {day && (
                      <View className={`w-10 h-10 rounded-full items-center justify-center ${
                        isSelected ? "bg-primary" : 
                        isToday ? "bg-primary/20" : 
                        ""
                      }`}>
                        <Text className={`font-medium ${
                          isSelected ? "text-primary-foreground" :
                          isToday ? "text-primary" :
                          "text-foreground"
                        }`}>
                          {day}
                        </Text>
                        {dayHasPosts && (
                          <View className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${
                            isSelected ? "bg-primary-foreground" : "bg-primary"
                          }`} />
                        )}
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </CardContent>
        </Card>

        {/* Selected Date Info */}
        {selectedDate && (
          <Card className="mb-6 border-primary/30">
            <CardContent className="p-4">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="font-semibold">
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </Text>
                <Pressable 
                  onPress={() => setShowScheduleSheet(true)}
                  className="bg-primary px-3 py-1.5 rounded-full flex-row items-center"
                >
                  <Plus size={16} className="text-primary-foreground mr-1" />
                  <Text className="text-primary-foreground text-sm font-medium">Schedule</Text>
                </Pressable>
              </View>
              
              {getPostsForDate(selectedDate.getDate()).length > 0 ? (
                <View className="gap-2">
                  {getPostsForDate(selectedDate.getDate()).map((post) => (
                    <View key={post._id} className="flex-row items-center justify-between bg-muted p-3 rounded-lg">
                      <View className="flex-row items-center">
                        <View className={`w-2 h-2 rounded-full mr-3 ${
                          post.status === 'posted' ? 'bg-green-500' : 'bg-blue-500'
                        }`} />
                        <View>
                          <Text className="font-medium text-sm">{post.platform}</Text>
                          <Text variant="muted" className="text-xs">{post.scheduledTime}</Text>
                        </View>
                      </View>
                      <Pressable onPress={() => handleDelete(post._id)}>
                        <Trash2 size={16} className="text-red-500" />
                      </Pressable>
                    </View>
                  ))}
                </View>
              ) : (
                <Text variant="muted" className="text-sm">No posts scheduled for this date.</Text>
              )}
            </CardContent>
          </Card>
        )}

        {/* Upcoming Posts */}
        <Text variant="h3" className="mb-4">Upcoming Posts</Text>
        <View className="gap-3 mb-6">
          {scheduledPosts
            .filter(post => post.status === 'scheduled')
            .slice(0, 5)
            .map((post) => (
              <Card key={post._id}>
                <CardContent className="p-4">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
                        <CalendarDays size={18} className="text-primary" />
                      </View>
                      <View>
                        <Text className="font-semibold">{post.platform}</Text>
                        <Text variant="muted" className="text-xs">
                          {new Date(post.scheduledDate).toLocaleDateString()} at {post.scheduledTime}
                        </Text>
                      </View>
                    </View>
                    <Pressable onPress={() => handleDelete(post._id)}>
                      <Trash2 size={18} className="text-muted-foreground" />
                    </Pressable>
                  </View>
                </CardContent>
              </Card>
            ))}
          {scheduledPosts.filter(post => post.status === 'scheduled').length === 0 && (
            <Card className="bg-muted/50">
              <CardContent className="p-5">
                <Text className="text-center text-muted-foreground">
                  No upcoming posts. Select a date on the calendar to schedule content.
                </Text>
              </CardContent>
            </Card>
          )}
        </View>

        {/* Best Times */}
        <Text variant="h3" className="mb-4">Optimal Posting Times</Text>
        <View className="gap-3 mb-6">
          {timeSlots.map((slot) => (
            <Card key={slot.id} className={slot.optimal ? "border-primary/30" : ""}>
              <CardContent className="p-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className={`w-12 h-12 rounded-xl ${slot.optimal ? "bg-primary/10" : "bg-muted"} items-center justify-center mr-4`}>
                      <slot.icon size={24} className={slot.optimal ? "text-primary" : "text-muted-foreground"} />
                    </View>
                    <View>
                      <Text className="font-semibold">{slot.label}</Text>
                      <Text variant="muted" className="text-sm">{slot.time}</Text>
                    </View>
                  </View>
                  {slot.optimal && (
                    <Badge variant="default">
                      <Text className="text-xs text-primary-foreground">Optimal</Text>
                    </Badge>
                  )}
                </View>
              </CardContent>
            </Card>
          ))}
        </View>

        {/* Content Mix */}
        <Text variant="h3" className="mb-4">Content Mix Strategy</Text>
        <Card className="mb-6">
          <CardContent className="p-4">
            {/* Progress Bar */}
            <View className="flex-row h-4 rounded-full overflow-hidden mb-4">
              {contentMixPercentages.map((item) => (
                <View 
                  key={item.type} 
                  className={`${item.color}`} 
                  style={{ flex: item.percentage / 100 }}
                />
              ))}
            </View>
            
            <View className="gap-3">
              {contentMixPercentages.map((item) => (
                <View key={item.type} className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className={`w-3 h-3 rounded-full ${item.color} mr-3`} />
                    <Text className="text-sm">{item.type}</Text>
                  </View>
                  <Text className="font-semibold text-sm">{item.percentage}%</Text>
                </View>
              ))}
            </View>
          </CardContent>
        </Card>

        {/* Notifications Toggle */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="font-semibold mb-1">Smart Reminders</Text>
                <Text variant="muted" className="text-xs">Get notified 30 min before posting times</Text>
              </View>
              <Switch 
                checked={notifications} 
                onCheckedChange={setNotifications}
              />
            </View>
          </CardContent>
        </Card>
      </ScrollView>

      {/* Schedule Sheet */}
      {showScheduleSheet && selectedDate && (
        <View className="absolute inset-0 bg-black/50 justify-end">
          <View className="bg-background rounded-t-3xl p-6 max-h-[80%]">
            <View className="flex-row items-center justify-between mb-6">
              <View>
                <Text variant="h3">Schedule Post</Text>
                <Text variant="muted" className="text-sm">
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </Text>
              </View>
              <Pressable onPress={() => setShowScheduleSheet(false)}>
                <Text className="text-muted-foreground">Close</Text>
              </Pressable>
            </View>

            {scripts.length === 0 ? (
              <View className="py-8">
                <Text className="text-center text-muted-foreground mb-4">
                  No scripts available. Create a script first.
                </Text>
                <Button onPress={() => { setShowScheduleSheet(false); }}>
                  <Text className="text-primary-foreground">Go to Scripts</Text>
                </Button>
              </View>
            ) : (
              <ScrollView className="max-h-[400px]">
                <Text className="font-semibold mb-3">Select Script</Text>
                <View className="gap-2 mb-6">
                  {scripts.slice(0, 5).map((script) => (
                    <Card key={script._id} className="bg-muted">
                      <CardContent className="p-3">
                        <Text className="font-medium text-sm mb-2" numberOfLines={1}>{script.title}</Text>
                        <Text variant="muted" className="text-xs mb-3" numberOfLines={2}>
                          "{script.hook}"
                        </Text>
                        
                        <Text className="text-xs font-medium mb-2">Select Time Slot:</Text>
                        <View className="flex-row gap-2">
                          {timeSlots.map((slot) => (
                            <Pressable
                              key={slot.id}
                              onPress={() => handleSchedule(script._id, 'TikTok', slot.time)}
                              className="flex-1 bg-background px-3 py-2 rounded-lg items-center"
                            >
                              <Text className="text-xs font-medium">{slot.time}</Text>
                            </Pressable>
                          ))}
                        </View>
                      </CardContent>
                    </Card>
                  ))}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
