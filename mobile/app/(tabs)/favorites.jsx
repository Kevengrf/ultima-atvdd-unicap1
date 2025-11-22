import { View, Text, Alert, ScrollView, TouchableOpacity, FlatList } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { favoritesStyles } from "../../assets/styles/favorites.styles";
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import RecipeCard from "../../components/RecipeCard";
import NoFavoritesFound from "../../components/NoFavoritesFound";
import LoadingSpinner from "../../components/LoadingSpinner";
import { mealAPI } from "../../services/mealAPI";
import { authService } from "../../services/authService";
import { useRouter, useFocusEffect } from "expo-router";

const FavoritesScreen = () => {
  const router = useRouter();
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getStoredUserId = async () => {
      const id = await authService.getUserId();
      setUserId(id);
    };
    getStoredUserId();
  }, []);

  const loadFavorites = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const fetchedFavorites = await mealAPI.getUserFavorites(userId);
      
      const transformedFavorites = fetchedFavorites.map(recipe => ({
        id: recipe.id,
        title: recipe.name,
        description: recipe.description,
        image: recipe.image || require("../../assets/images/i1.png"), // Placeholder image
        cookTime: "30 minutes", // Placeholder
        servings: 4, // Placeholder
        category: "Unknown", // Category name is not directly returned by favorites endpoint
        area: "Global", // Placeholder
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
      }));

      setFavoriteRecipes(transformedFavorites);
    } catch (error) {
      console.error("Error loading favorites", error);
      Alert.alert("Error", error.message || "Failed to load favorites");
      setFavoriteRecipes([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  const handleSignOut = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: async () => {
        await authService.removeToken();
        await authService.removeUserId();
        router.replace("/(auth)/sign-in");
      }},
    ]);
  };

  if (loading) return <LoadingSpinner message="Loading your favorites..." />;

  return (
    <View style={favoritesStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={favoritesStyles.header}>
          <Text style={favoritesStyles.title}>Favorites</Text>
          <TouchableOpacity style={favoritesStyles.logoutButton} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={22} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <View style={favoritesStyles.recipesSection}>
          {favoriteRecipes.length > 0 ? (
            <FlatList
              data={favoriteRecipes}
              renderItem={({ item }) => <RecipeCard recipe={item} />}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={favoritesStyles.row}
              contentContainerStyle={favoritesStyles.recipesGrid}
              scrollEnabled={false}
            />
          ) : (
            <NoFavoritesFound />
          )}
        </View>
      </ScrollView>
    </View>
  );
};
export default FavoritesScreen;
