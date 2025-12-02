import { View, Text, Alert, ScrollView, FlatList } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { favoritesStyles } from "../../assets/styles/favorites.styles";
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import RecipeCard from "../../components/RecipeCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import { mealAPI } from "../../services/mealAPI";
import { useFocusEffect } from "expo-router";


const FavoritesScreen = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRecipes = useCallback(async () => {
    setLoading(true);
    try {
      const allRecipes = await mealAPI.getAllRecipes();
      
      const transformedRecipes = allRecipes.map(recipe => ({
        id: recipe.id,
        title: recipe.name,
        description: recipe.description,
        image: recipe.image || require("../../assets/images/i1.png"), // Placeholder image
        cookTime: "30 minutes", // Placeholder
        servings: 4, // Placeholder
        category: "Unknown", // Category name is not directly returned by all recipes endpoint
        area: "Global", // Placeholder
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
      }));

      setRecipes(transformedRecipes);
    } catch (error) {
      console.error("Error loading recipes", error);
      Alert.alert("Error", error.message || "Failed to load recipes");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadRecipes();
    }, [loadRecipes])
  );

  if (loading) return <LoadingSpinner message="Loading all recipes..." />;

  return (
    <View style={favoritesStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={favoritesStyles.header}>
          <Text style={favoritesStyles.title}>All Recipes</Text>
        </View>

        <View style={favoritesStyles.recipesSection}>
          {recipes.length > 0 ? (
            <FlatList
              data={recipes}
              renderItem={({ item }) => <RecipeCard recipe={item} />}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={favoritesStyles.row}
              contentContainerStyle={favoritesStyles.recipesGrid}
              scrollEnabled={false}
            />
          ) : (
            <View style={favoritesStyles.emptyState}>
              <Ionicons name="restaurant-outline" size={64} color={COLORS.textLight} />
              <Text style={favoritesStyles.emptyTitle}>No recipes found</Text>
              <Text style={favoritesStyles.emptyDescription}>Try again later</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};
export default FavoritesScreen;
