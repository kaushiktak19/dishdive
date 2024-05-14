import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams
} from "react-router-dom";
// import './App.css';


const API_KEY_1 = "3888e933fbb84ffa8be6c319824f7aa1"
const API_KEY_2 = "29772739f6ce44689af6d4e281d8ed5c"

export default function App() {

  const [favorites, setFavorites] = useState([]);
  return (
      <Router>
      <div className="window">
        <div>
          <h2 >DishDive</h2>
          <nav>
            <Link to="/" >Home</Link>
            <Link to="/search">Search</Link> 
            <Link to="/details">Details</Link>
            <Link to="/favorites" >Favorites</Link>
          </nav>
        </div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search favorites={favorites} setFavorites={setFavorites} />} />
          <Route path="/details/:id" element={<Details favorites={favorites} setFavorites={setFavorites}/>} />
          <Route path="/favorites" element={<Favorites favorites={favorites} setFavorites={setFavorites}/>} />
        </Routes>

      </div>
        
      </Router>  
    
  )
}

function Home() {
  return (
    <h2>Home</h2>  
  )
}

function Search({favorites, setFavorites}) {
  const[query, setQuery] = useState("")
  const [recipe, setRecipe] = useState([])

  function handleChange(event){
    setQuery(event.target.value)
  }

  async function handleSearch(event) {
    event.preventDefault();
    try{
      const response = await fetch(
        // `https://api.edamam.com/api/recipes/v2?type=any&q=${query}&app_id=818dbfb1&app_key=23bcde96abdc72c39c9debb07ce5d55a`
        `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY_2}&query=${query}`
      );
      const data = await response.json();
      console.log(data);
      setRecipe(data.results);
    }
    catch{
    
    }  
  }

  async function handleAddToFavorites() {
    const isRecipeInFavorites = favorites.some(favRecipe => favRecipe.id === recipe.id);
    // If the recipe is not already in favorites, add it
    if (!isRecipeInFavorites) {
      setFavorites(prevFavorites => [...prevFavorites, recipe]);
    }
  }

  let recipeList = null;

  if (recipe && recipe.length > 0) {
    recipeList = recipe.map((r) => 
      <li key={r.id} >
        <img src={r.image} alt={r.title} />
        <br />
        <Link to={`/details/${r.id}`}>{r.title}</Link>
        <button onClick={() => handleAddToFavorites(r)}>Add to Favorites</button> 
        {/* wrap each recipe with a Link passing the recipe ID as a parameter */}
        <br />
      </li> 
      
    )
  }
  
  
  return (
    <>
      <label>
        <input type="text" value={query} onChange={handleChange} placeholder="Search for a recipe"/>
        <button onClick={handleSearch}>Search</button>
      </label>

      <div >
        
          {recipeList}
        
      </div>
    </>
  );
}

function Details({favorites, setFavorites}) {

  const {id} = useParams();
  
  const [recipeDetails, setRecipeDetails] = useState([])

  useEffect(() => {
    async function handleDetails() {
      try {
        const response = await fetch(
            `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY_1}`
        );
        const data = await response.json();
        console.log(data);
        setRecipeDetails(data);
      }
      catch (error) {
        console.error("Error fetching recipe details:", error);
      }
    }
    handleDetails();
  }, [id]);

  async function handleAddToFavorites(recipe) {
    const isRecipeInFavorites = favorites.some(favRecipe => favRecipe.id === recipe.id);
    // If the recipe is not already in favorites, add it
    if (!isRecipeInFavorites) {
    setFavorites(prevFavorites => [...prevFavorites, recipe]);
    }
  }

  // let newSteps = recipeDetails.steps.map((s) => 
  //   <div>
  //     <li key={s.number}>{s}</li>
  //     <ul>
  //       <li>
  //         {s.ingredients.map((i) =>
  //           <li key={i.id}>{i}</li>
  //         )}
  //       </li>
  //     </ul>
  //   </div>
  // )

  let newStepsAndIngredients = null;
  if (recipeDetails && recipeDetails.analyzedInstructions && recipeDetails.analyzedInstructions.length > 0) {
    newStepsAndIngredients = recipeDetails.analyzedInstructions[0].steps.map((step, index) => (
      <li key={index}>
        {step.step}
        {step.ingredients && step.ingredients.length > 0 &&
          (
          <ul>
            <p>Ingredients Required : 
              {step.ingredients.map((ingredient, index) => (
                <span key={index}>
                  {ingredient.name}
                  {index !== step.ingredients.length - 1 ? ',' : '.'}
              </span>
              ))}
            </p>
          </ul>
          )
        }
      </li>
    ));
  }

  return (
    <div>
      <h1>Details</h1>
      <h2>{recipeDetails.title}</h2>
      <button onClick={() => handleAddToFavorites(recipeDetails)}>Add to Favorites</button>
      {/* <button onClick={handleFavourites}>Add to Favorites</button> */}
      <div>
        <h4>Steps to prepare - </h4>
        <ui>
          {newStepsAndIngredients}
        </ui>
      </div>
    </div>
  )
}

function Favorites({favorites, setFavorites}) {

  function removeFavorites(idToRemove) {
    const updatedFavorites = favorites.filter(
      (r) => r.id !== idToRemove
    )
    setFavorites(updatedFavorites);
  }

  return (
    <div>
      <h1>Favorites</h1>
      <ul>
        {favorites.map(recipe => (
          <li key={recipe.id}>
            <img src={recipe.image} alt={recipe.title} />
            <span>{recipe.title}</span>
            <button onClick={() => removeFavorites(recipe.id)}>
              Remove from Favorites
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
