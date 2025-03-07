import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import icons from "@/constants/icons";
import Search from "@/components/Search";
import { Card } from "@/components/Cards";
import Filters from "@/components/Filters";
import { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useAppwrite } from "@/lib/useAppwrite";
import NoResults from "@/components/NoResults";
import { getProperties } from "@/lib/appwrite";

export default function Explore() {
  const params = useLocalSearchParams<{ query?: string; filter?: string }>();

  const {
    data: properties,
    loading: loading,
    refetch,
  } = useAppwrite({
    fn: getProperties,
    params: {
      filter: params.filter!,
      searchQuery: params.query!,
      limit: 20,
    },
    skip: true,
  });

  const handleCardPress = (id: string) => router.push(`/properties/${id}`);

  // reload data when filters change, etc.
  useEffect(() => {
    refetch({
      filter: params.filter!,
      searchQuery: params.query!,
      limit: 20,
    });
  }, [params.filter, params.query]);

  return (
    <SafeAreaView className={"bg-white h-full"}>
      <FlatList
        data={properties}
        numColumns={2}
        renderItem={({ item }) => (
          <Card item={item} onPress={() => handleCardPress(item.$id)} />
        )}
        keyExtractor={(item) => item.$id}
        contentContainerClassName={"pb-32"}
        columnWrapperClassName={"flex gap-5 px-5"}
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator
              size={"large"}
              className={"text-primary-300 mt-5"}
            />
          ) : (
            <NoResults />
          )
        }
        ListHeaderComponent={
          <View className={"px-5"}>
            {/* Back button */}
            <View className={"flex flex-row items-center justify-between mt-5"}>
              <TouchableOpacity
                onPress={() => router.back()}
                className={
                  "flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center"
                }
              >
                <Image source={icons.backArrow} className={"size-5"} />
              </TouchableOpacity>

              <Text
                className={
                  "text-base mr-2 text-center font-rubik-medium text-black-300"
                }
              >
                Search for Your Ideal Home
              </Text>
              <Image source={icons.bell} className={"w-6 h-6"} />
            </View>

            {/* Search */}
            <Search />

            <View className={"mt-5"}>
              {/* Filters */}
              <Filters />

              <Text className={"text-xl font-rubik-bold text-black-300 mt-5"}>
                Found {properties?.length} Properties
              </Text>
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}
