import {
  Image,
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Platform,
} from "react-native";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import images from "@/constants/images";
import icons from "@/constants/icons";
import { useAppwrite } from "@/lib/useAppwrite";
import { getPropertyById } from "@/lib/appwrite";
import { facilities } from "@/constants/data";

const Property = () => {
  // gets the 'id' from the route parameter
  const { id } = useLocalSearchParams<{ id?: string }>();
  const windowHeight = Dimensions.get("window").height;

  // get property details
  const { data: property } = useAppwrite({
    fn: getPropertyById,
    params: {
      id: id!,
    },
  });

  return (
    <View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName={"pb-32 bg-white"}
      >
        <View
          className={"relative w-full"}
          style={{ height: windowHeight / 2 }}
        >
          {/* header picture */}
          <Image
            source={{ uri: property?.image }}
            className={"size-full"}
            resizeMode={"cover"}
          />
          {/* gradient over header picture */}
          <Image
            source={images.whiteGradient}
            className={"absolute top-0 z-40"}
          />

          {/* Back, Heart and Email */}
          <View
            className={"z-50 absolute inset-x-7"}
            style={{ top: Platform.OS === "ios" ? "70" : "30" }}
          >
            <View
              className={"flex flex-row items-center w-full justify-between"}
            >
              <TouchableOpacity
                onPress={() => router.back()}
                className={
                  "flex flex-row bg-white rounded-full size-11 items-center justify-center"
                }
              >
                <Image source={icons.backArrow} className={"size-5"} />
              </TouchableOpacity>
              <View className={"flex flex-row items-center gap-3"}>
                <Image
                  source={icons.heart}
                  className={"size-7"}
                  tintColor={"#101D31"}
                />
                <Image source={icons.send} className={"size-7"} />
              </View>
            </View>
          </View>
        </View>
        <View className={"px-5 mt-7 flex gap-2"}>
          {/* Property Header */}
          <Text className={"text-2xl font-rubik-extrabold"}>
            {property?.name}
          </Text>
          <View className={"flex flex-row items-center gap-3"}>
            <View
              className={
                "flex flex-row items-center px-4 py-2 bg-primary-100 rounded-full"
              }
            >
              <Text className={"text-xs font-rubik-bold text-primary-300"}>
                {property?.type}
              </Text>
            </View>

            <View className={"flex flex-row items-center gap-2"}>
              <Image source={icons.star} className={"size-5"} />
              <Text className={"text-black-200 text-sm mt-1 font-rubik-medium"}>
                {property?.rating} ({property?.reviews.length} reviews)
              </Text>
            </View>
          </View>

          {/* Property Detail */}
          <View className={"flex flex-row items-center mt-5"}>
            <View
              className={
                "flex flex-row items-center justify-center bg-primary-100 rounded-full size-10"
              }
            >
              <Image source={icons.bed} className={"size-4"} />
            </View>
            <Text className={"text-black-300 text-sm font-rubik-medium ml-2"}>
              {property?.bedrooms} Beds
            </Text>
            <View
              className={
                "flex flex-row items-center justify-center bg-primary-100 rounded-full size-10 ml-7"
              }
            >
              <Image source={icons.bath} className={"size-4"} />
            </View>
            <Text className={"text-black-300 text-sm font-rubik-medium ml-2"}>
              {property?.bathrooms} Baths
            </Text>
            <View
              className={
                "flex flex-row items-center justify-center bg-primary-100 rounded-full size-10 ml-7"
              }
            >
              <Image source={icons.area} className={"size-4"} />
            </View>
            <Text className={"text-black-300 text-sm font-rubik-medium ml-2"}>
              {property?.area} sqft
            </Text>
          </View>

          {/* Agent Detail */}
          <View className={"w-full border-t border-primary-200 pt-7 mt-5"}>
            <Text className={"text-black-300 text-xl font-rubik-bold"}>
              Agent
            </Text>
            <View className={"flex flex-row items-center justify-between mt-4"}>
              <View className={"flex flex-row items-center"}>
                <Image
                  source={{ uri: property?.agent.avatar }}
                  className={"size-14 rounded-full"}
                />
                <View
                  className={"flex flex-col items-start justify-center ml-3"}
                >
                  <Text
                    className={
                      "text-lg text-black-300 text-start font-rubik-bold"
                    }
                  >
                    {property?.agent.name}
                  </Text>
                  <Text
                    className={
                      "text-sm text-black-200 txt-start font-rubik-medium"
                    }
                  >
                    {property?.agent.email}
                  </Text>
                </View>
              </View>

              <View className={"flex flex-row items-center gap-3"}>
                <Image source={icons.chat} className={"size-7"} />
                <Image source={icons.phone} className={"size-7"} />
              </View>
            </View>
          </View>

          {/* Overview Detail */}
          <View className={"mt-7"}>
            <Text className={"text-black-300 text-xl font-rubik-bold"}>
              Overview
            </Text>
            <Text className={"text-black-200 text-base font-rubik mt-2"}>
              {property?.description}
            </Text>
          </View>

          {/* Facilities Detail */}
          <View className={"mt-7"}>
            <Text className={"text-black-300 text-xl font-rubik-bold"}>
              Facilities
            </Text>

            {property?.facilities.length > 0 && (
              <View
                className={
                  "flex flex-row flex-wrap items-start justify-start mt-2 gap-5"
                }
              >
                {property?.facilities.map((item: string, i: number) => {
                  const facility = facilities.find((f) => f.title === item);

                  return (
                    <View
                      key={i}
                      className={
                        "flex flex-1 flex-col items-center min-w-16 max-w-20"
                      }
                    >
                      <View
                        className={
                          "size-14 bg-primary-100 rounded-full flex items-center justify-center"
                        }
                      >
                        <Image
                          source={facility ? facility.icon : icons.info}
                          className={"size-6"}
                        />
                      </View>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode={"tail"}
                        className={
                          "text-black-300 text-sm text-center font-rubik-medium mt-1.5"
                        }
                      >
                        {item}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          {/* Gallery Detail */}
        </View>
      </ScrollView>
    </View>
  );
};
export default Property;
