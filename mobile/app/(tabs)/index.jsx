import { View, Text, ScrollView, TouchableOpacity, FlatList, RefreshControl, Alert } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { mealAPI } from "../../services/mealAPI";
import { homeStyles } from "../../assets/styles/home.styles";
import { Image } from "expo-image";
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import CategoryFilter from "../../components/CategoryFilter";
import RecipeCard from "../../components/RecipeCard";
import LoadingSpinner from "../../components/LoadingSpinner";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const HomeScreen = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredRecipe, setFeaturedRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);

      const [backendCategories, allRecipes] = await Promise.all([
        mealAPI.getAllCategories(),
        mealAPI.getAllRecipes(),
      ]);

      setCategories(backendCategories);

      if (!selectedCategory && backendCategories.length > 0) {
        setSelectedCategory(backendCategories[0].name);
      }

      // For now, let's assume the first recipe is the featured one.
      // In a real app, you might have a dedicated featured recipe endpoint or logic.
      if (allRecipes.length > 0) {
        const firstRecipe = allRecipes[0];
        setFeaturedRecipe({
          id: firstRecipe.id,
          title: firstRecipe.name,
          description: firstRecipe.description,
          image: firstRecipe.image || require("../../assets/images/i1.png"), // Placeholder image
          cookTime: "30 minutes", // Placeholder
          servings: 4, // Placeholder
          category: backendCategories.find(cat => cat.id === firstRecipe.category_id)?.name || "Unknown",
          area: "Global", // Placeholder
          ingredients: firstRecipe.ingredients,
          instructions: firstRecipe.instructions,
        });
      } else {
        setFeaturedRecipe(null);
      }
      
      setRecipes(allRecipes.map(recipe => ({
        id: recipe.id,
        title: recipe.name,
        description: recipe.description,
        image: recipe.image || require("../../assets/images/i1.png"), // Placeholder image
        cookTime: "30 minutes", // Placeholder
        servings: 4, // Placeholder
        category: backendCategories.find(cat => cat.id === recipe.category_id)?.name || "Unknown",
        area: "Global", // Placeholder
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
      })));

    } catch (error) {
      console.error("Error loading the data", error);
      Alert.alert("Error", error.message || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const loadCategoryData = async (categoryId) => {
    try {
      setLoading(true);
      const categoryRecipes = await mealAPI.getRecipesByCategoryId(categoryId);
      setRecipes(categoryRecipes.map(recipe => ({
        id: recipe.id,
        title: recipe.name,
        description: recipe.description,
        image: recipe.image || require("../../assets/images/i1.png"), // Placeholder image
        cookTime: "30 minutes", // Placeholder
        servings: 4, // Placeholder
        category: categories.find(cat => cat.id === recipe.category_id)?.name || "Unknown",
        area: "Global", // Placeholder
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
      })));
    } catch (error) {
      console.error("Error loading category data:", error);
      Alert.alert("Error", error.message || "Failed to load category recipes.");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = async (categoryName) => {
    setSelectedCategory(categoryName);
    const category = categories.find(cat => cat.name === categoryName);
    if (category) {
      await loadCategoryData(category.id);
    } else {
      setRecipes([]); // No category found, clear recipes
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // await sleep(2000);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading && !refreshing) return <LoadingSpinner message="Loading delicions recipes..." />;

  return (
    <View style={homeStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        contentContainerStyle={homeStyles.scrollContent}
      >
        {/*  ANIMAL ICONS */}
        <View style={homeStyles.welcomeSection}>
          <Image
            source={require("../../assets/images/lamb.png")}
            style={{
              width: 100,
              height: 100,
            }}
          />
          <Image
            source={require("../../assets/images/chicken.png")}
            style={{
              width: 100,
              height: 100,
            }}
          />
          <Image
            source={require("../../assets/images/pork.png")}
            style={{
              width: 100,
              height: 100,
            }}
          />
        </View>

        {/* FEATURED SECTION */}
        {featuredRecipe && (
          <View style={homeStyles.featuredSection}>
            <TouchableOpacity
              style={homeStyles.featuredCard}
              activeOpacity={0.9}
              onPress={() => router.push(`/recipe/${featuredRecipe.id}`)}
            >
              <View style={homeStyles.featuredImageContainer}>
                <Image
                  source={{ uri: featuredRecipe.image }}
                  style={homeStyles.featuredImage}
                  contentFit="cover"
                  transition={500}
                />
                <View style={homeStyles.featuredOverlay}>
                  <View style={homeStyles.featuredBadge}>
                    <Text style={homeStyles.featuredBadgeText}>Featured</Text>
                  </View>

                  <View style={homeStyles.featuredContent}>
                    <Text style={homeStyles.featuredTitle} numberOfLines={2}>
                      {featuredRecipe.title}
                    </Text>

                    <View style={homeStyles.featuredMeta}>
                      <View style={homeStyles.metaItem}>
                        <Ionicons name="time-outline" size={16} color={COLORS.white} />
                        <Text style={homeStyles.metaText}>{featuredRecipe.cookTime}</Text>
                      </View>
                      <View style={homeStyles.metaItem}>
                        <Ionicons name="people-outline" size={16} color={COLORS.white} />
                        <Text style={homeStyles.metaText}>{featuredRecipe.servings}</Text>
                      </View>
                      {featuredRecipe.area && (
                        <View style={homeStyles.metaItem}>
                          <Ionicons name="location-outline" size={16} color={COLORS.white} />
                          <Text style={homeStyles.metaText}>{featuredRecipe.area}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {categories.length > 0 && (
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        )}

        <View style={homeStyles.recipesSection}>
          <View style={homeStyles.sectionHeader}>
            <Text style={homeStyles.sectionTitle}>{selectedCategory}</Text>
          </View>

          {recipes.length > 0 ? (
            <FlatList
              data={recipes}
              renderItem={({ item }) => <RecipeCard recipe={item} />}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={homeStyles.row}
              contentContainerStyle={homeStyles.recipesGrid}
              scrollEnabled={false}
              // ListEmptyComponent={}
            />
          ) : (
            <View style={homeStyles.emptyState}>
              <Ionicons name="restaurant-outline" size={64} color={COLORS.textLight} />
              <Text style={homeStyles.emptyTitle}>No recipes found</Text>
              <Text style={homeStyles.emptyDescription}>Try a different category</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};
export default HomeScreen;
