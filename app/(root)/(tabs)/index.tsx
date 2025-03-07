import {
  Button,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import icons from "@/constants/icons";
import Search from "@/components/Search";
import { Card, FeaturedCard } from "@/components/Cards";
import Filters from "@/components/Filters";
import { useGlobalContext } from "@/lib/global-provider";
import { useEffect, useState } from "react";

function getGreeting(): string {
  const now = new Date();
  const hours = now.getHours();

  if (hours < 12) return "Good Morning";
  if (hours > 12 && hours < 18) return "Good Afternoon";
  return "Good Evening";
}

export default function Index() {
  const { user } = useGlobalContext();
  const [greeting, setGreeting] = useState(getGreeting());

  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000); // update every 1 min

    // stop interval when this component unmounts
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView className={"bg-white h-full"}>
      {/* Recommended Cards */}
      <FlatList
        data={[1, 2, 3, 4, 5]}
        renderItem={({ item }) => <Card />}
        keyExtractor={(item) => item.toString()}
        numColumns={2}
        contentContainerClassName={"pb-32"}
        columnWrapperClassName={"flex gap-5 px-5"}
        showsHorizontalScrollIndicator={false}
        ListHeaderComponent={
          <View className={"px-5"}>
            <View className={"flex flex-row items-center justify-between mt-5"}>
              <View className={"flex flex-row items-center"}>
                <Image
                  source={{ uri: user?.avatar }}
                  className={"size-12 rounded-full"}
                />
                <View
                  className={"flex flex-col items-start ml-2 justify-center"}
                >
                  <Text className={"text-xs font-rubik text-black-100"}>
                    {greeting}
                  </Text>
                  <Text
                    className={"text-base font-rubik-medium text-black-300"}
                  >
                    {user?.name}
                  </Text>
                </View>
              </View>
              <Image source={icons.bell} className={"size-6"} />
            </View>
            {/* Search */}
            <Search />
            <View className={"my-5"}>
              {/* Feature Heading */}
              <View className={"flex flex-row items-center justify-between"}>
                <Text className={"text-xl font-rubik-bold text-black-300"}>
                  Featured
                </Text>
                <TouchableOpacity>
                  <Text
                    className={"text-base font-rubik-bold text-primary-300"}
                  >
                    See All
                  </Text>
                </TouchableOpacity>
              </View>
              {/* Featured Cards (forms part of the header section of the main flat list) */}
              <FlatList
                data={[10, 11, 12, 13]}
                renderItem={({ item }) => <FeaturedCard />}
                keyExtractor={(item) => item.toString()}
                horizontal
                bounces={false}
                showsHorizontalScrollIndicator={false}
                contentContainerClassName={"flex gap-5 mt-5"}
              />
            </View>
            {/* Recommendations Heading*/}
            <View className={"flex flex-row items-center justify-between"}>
              <Text className={"text-xl font-rubik-bold text-black-300"}>
                Our Recommendation
              </Text>
              <TouchableOpacity>
                <Text className={"text-base font-rubik-bold text-primary-300"}>
                  See All
                </Text>
              </TouchableOpacity>
            </View>
            {/* Filters */}
            <Filters />
            {/* Recommended Cards */}
          </View>
        }
      />
    </SafeAreaView>
  );
}
