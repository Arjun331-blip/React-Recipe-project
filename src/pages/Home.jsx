import React, { useEffect, useState } from "react";
import axios from "axios";
import RecipeCard from "../components/RecipeCard";

function Home() {
  let [recipes, setRecipes] = useState([]);
  let [total, setTotal] = useState(0);
  let [loading, setLoading] = useState(true);
  let [errorMessage, setErrorMessage] = useState("");
  let [searchQuery, setSearchQuery] = useState("");

  async function fetchRecipe(skipCount, query) {
    setLoading(true);
    try {
      let url = `https://dummyjson.com/recipes?limit=6&skip=${skipCount}`;
      if(query){
        url = `https://dummyjson.com/recipes/search?limit=6&skip=${skipCount}&q=${query}`;
      }
      let { data } = await axios.get(url);
      setRecipes(prev => 
        skipCount == 0? data.recipes : [...prev, ...data.recipes]);
      setTotal(data.total)
    } catch (err){
      console.log(err)
      setErrorMessage("Please try again leter");
    }
      setLoading(false);
  }

  useEffect(() => {
    fetchRecipe(0);
  }, []);

  function handleSearch(e){
    e.preventDefault();
    let form = new FormData(e.target);
    let query = form.get("query");
    setSearchQuery(query);
    fetchRecipe(0, query);
  }

  // if(loading){
  //   return <div className="text-muted font-medium text-center py-28">Loading...</div>
  // }

  if(errorMessage){
    return (
    <main>
      <p className="text-accent py-9 text-center">{errorMessage || "Recipe Not Found"}</p>
    </main>
    );
  }
  
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <form className="flex gap-2 max-w-md mx-auto mb-8" onSubmit={handleSearch}>
        <input
          type="text"
          name="query"
          placeholder="Search recipes..."
          className="flex-1 border border-border rounded px-3 py-2 bg-card text-text outline-none focus:border-accent"
        />
        <button
          type="submit"
          className="bg-accent hover:bg-accent-hover text-white rounded px-4 py-2 font-medium"
        >
          Search
        </button>
      </form>
      {loading && <div className="text-muted font-medium text-center py-2">Loading...</div>}
      {!loading && recipes.length == 0 && <p className="text-muted font-medium text-center">no recipe found for "{searchQuery}"</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
      { recipes.length < total && <div className="text-center mt-8">
        <button
          type="button" onClick={() => fetchRecipe(recipes.length, searchQuery)}
          className="bg-accent hover:bg-accent-hover text-white rounded px-6 py-2 font-medium"
        >
          Load More
        </button>
      </div>}
    </main>
  );
}

export default Home;
