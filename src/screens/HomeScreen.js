import {
  View,
  Text,
  Button,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import { useTailwind } from "tailwind-rn";
import { Ionicons, Entypo, AntDesign } from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";
import {
  doc,
  serverTimestamp,
  setDoc,
  onSnapshot,
  collection,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import generateID from "../lib/generateId";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const swipeRef = useRef(null);
  const tw = useTailwind();
  const [profiles, setProfiles] = useState([]);

  useLayoutEffect(
    () =>
      onSnapshot(doc(db, "users", user.uid), (snapshot) => {
        if (!snapshot.exists()) {
          // if user doesn't exist in the database(snapshot)
          navigation.navigate("Modal");
        }
      }),
    []
  );

  // create user profile
  useEffect(() => {
    let unsub;

    const fetchCards = async () => {
      // get all the user id that this user passed(swiped left) from 'passes' db
      const passes = await getDocs(
        collection(db, "users", user.uid, "passes")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

      const swipes = await getDocs(
        collection(db, "users", user.uid, "swipes")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

      const superlikes = await getDocs(
        collection(db, "users", user.uid, "superlike")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

      // if user passed on anyone,
      const passedUserIDs = passes.length > 0 ? passes : ["test"];
      const swipedUserIDs = swipes.length > 0 ? swipes : ["test"];
      const superlikeUserIDs = superlikes.length > 0 ? superlikes : ["test"];

      // querying the user id from 'passes' db with the 'where'
      unsub = onSnapshot(
        query(
          collection(db, "users"),
          where("id", "not-in", [
            ...passedUserIDs,
            ...swipedUserIDs,
            ...superlikeUserIDs,
          ])
        ),
        (snapshot) => {
          setProfiles(
            // prevent showing user(themselves) card
            snapshot.docs
              .filter((doc) => doc.id !== user.uid)
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
          );
        }
      );
    };

    fetchCards();
    return unsub;
  }, [db]);

  // swipe left, right, up(if user swipe, add the cardindex to db)
  const swipeLeft = (cardIndex) => {
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];
    console.log(`You Swiped PASS on ${userSwiped.displayName}`);

    setDoc(doc(db, "users", user.uid, "passes", userSwiped.id), userSwiped);
  };

  const swipeRight = async (cardIndex) => {
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];
    const loggedInProfile = await (
      await getDoc(doc(db, "users", user.uid))
    ).data();

    // Check if the user swipped on you...
    getDoc(doc(db, "users", userSwiped.id, "swipes", user.uid)).then(
      (documentSnapshot) => {
        if (documentSnapshot.exists()) {
          // user has matched with you before you matched with them...
          console.log(`HOORAY, You MATCHED with ${userSwiped.displayName}`);

          setDoc(
            doc(db, "users", user.uid, "swipes", userSwiped.id),
            userSwiped
          );

          // Create MATCH
          setDoc(doc(db, "matches", generateID(user.uid, userSwiped.id)), {
            users: {
              [user.uid]: loggedInProfile,
              [userSwiped.id]: userSwiped,
            },
            usersMatched: [user.uid, userSwiped.id],
            timestamp: serverTimestamp(),
          });

          navigation.navigate("Match", {
            loggedInProfile,
            userSwiped,
          });
        } else {
          // user has swiped as first interaction between the two or never swiped on...
          console.log(
            `You Swiped on ${userSwiped.displayName} (${userSwiped.job})`
          );
          setDoc(
            doc(db, "users", user.uid, "swipes", userSwiped.id),
            userSwiped
          );
        }
      }
    );
  };

  const swipeTop = async (cardIndex) => {
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];
    const loggedInProfile = await (
      await getDoc(doc(db, "users", user.uid))
    ).data();

    // Check if the user swipped on you...
    getDoc(doc(db, "users", userSwiped.id, "swipes", user.uid)).then(
      (documentSnapshot) => {
        if (documentSnapshot.exists()) {
          // user has matched with you before you matched with them...
          console.log(`HOORAY, You MATCHED with ${userSwiped.displayName}`);

          setDoc(
            doc(db, "users", user.uid, "swipes", userSwiped.id),
            userSwiped
          );

          // Create MATCH
          setDoc(doc(db, "matches", generateID(user.uid, userSwiped.id)), {
            users: {
              [user.uid]: loggedInProfile,
              [userSwiped.id]: userSwiped,
            },
            usersMatched: [user.uid, userSwiped.id],
            timestamp: serverTimestamp(),
          });

          navigation.navigate("Match", {
            loggedInProfile,
            userSwiped,
          });
        } else {
          console.log(
            `You SuperLiked on ${userSwiped.displayName} (${userSwiped.job})`
          );

          setDoc(
            doc(db, "users", user.uid, "swipes", userSwiped.id),
            userSwiped
          );
        }
      }
    );
  };

  return (
    <SafeAreaView style={tw("flex-1")}>
      {/* Header */}

      <View style={tw("flex-row items-center justify-between px-5")}>
        <TouchableOpacity onPress={logout}>
          <Image
            style={tw("h-10 w-10 rounded-full")}
            source={{ uri: user.photoURL }}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
          <Image
            style={tw("h-14 w-14")}
            source={require("../images/logo.png")}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
          <Ionicons name="ios-chatbubbles-sharp" size={30} color="#FF5864" />
        </TouchableOpacity>
      </View>

      {/* End of Header */}
      {/* Cards */}
      <View style={tw("flex-1 -mt-6")}>
        <Swiper
          ref={swipeRef}
          containerStyle={{ backgroundColor: "transparent" }}
          cards={profiles}
          stackSize={5}
          cardIndex={0}
          disableBottomSwipe={true}
          onSwipedTop={(cardIndex) => {
            console.log("Swipe SUPERLIKE");
            swipeTop(cardIndex);
          }}
          onSwipedLeft={(cardIndex) => {
            console.log("Swipe PASS");
            swipeLeft(cardIndex);
          }}
          onSwipedRight={(cardIndex) => {
            console.log("Swipe MATCH");
            swipeRight(cardIndex);
          }}
          backgroundColor={"#4FD0E9"}
          overlayLabels={{
            left: {
              title: "NOPE",
              style: {
                label: {
                  textAlign: "right",
                  color: "red",
                },
              },
            },
            right: {
              title: "MATCH",
              style: {
                label: {
                  color: "#4DED30",
                },
              },
            },
            top: {
              title: "SUPER LIKE",
              style: {
                label: {
                  backgroundColor: "blue",
                  color: "white",
                },
                wrapper: {
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                },
              },
            },
          }}
          animateCardOpacity
          renderCard={(card) =>
            card ? (
              <View
                key={card.id}
                style={tw("relative bg-white h-3/4 rounded-xl")}
              >
                <Image
                  style={tw("absolute top-0 h-full w-full rounded-xl")}
                  source={{ uri: card.photoURL }}
                />

                <View
                  style={[
                    tw(
                      "absolute bottom-0 bg-white w-full flex-row justify-between items-center h-20 px-6 py-2 rounded-b-xl"
                    ),
                    styles.cardShadow,
                  ]}
                >
                  <View>
                    <Text style={tw("text-xl font-bold")}>
                      {card.displayName}
                    </Text>
                    <Text>{card.job}</Text>
                  </View>
                  <Text style={tw("text-2xl font-bold")}>{card.age}</Text>
                </View>
              </View>
            ) : (
              <View
                style={[
                  tw(
                    "relative bg-white rounded-xl h-3/4 justify-center items-center"
                  ),
                  styles.cardShadow,
                ]}
              >
                <Text style={tw("pb-5 font-bold")}>No more profiles</Text>

                <Image
                  style={tw("h-20 w-20")}
                  height={100}
                  width={100}
                  source={{
                    uri: "https://cdn.shopify.com/s/files/1/1061/1924/products/Crying_Face_Emoji_large.png?v=1571606037",
                  }}
                />
              </View>
            )
          }
        />
      </View>

      <View style={tw("flex flex-row justify-evenly")}>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeLeft()}
          style={tw(
            "items-center justify-center rounded-full w-16 h-16 bg-red-200"
          )}
        >
          <Entypo name="cross" size={24} color="red" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => swipeRef.current.swipeTop()}
          style={tw(
            "items-center justify-center rounded-full w-16 h-16 bg-blue-200"
          )}
        >
          <AntDesign name="star" size={24} color="blue" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => swipeRef.current.swipeRight()}
          style={tw(
            "items-center justify-center rounded-full w-16 h-16 bg-green-200"
          )}
        >
          <AntDesign name="heart" size={24} color="green" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
