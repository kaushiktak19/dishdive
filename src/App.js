import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams
} from "react-router-dom";
import './App.css';


const API_KEY_1 = "3888e933fbb84ffa8be6c319824f7aa1"
const API_KEY_2 = "29772739f6ce44689af6d4e281d8ed5c"

export default function App() {

  const [favorites, setFavorites] = useState([]);
  const [recipe, setRecipe] = useState([])

  
  // async function handleAddToFavorites() {
  //   const isRecipeInFavorites = favorites.some(favRecipe => favRecipe.id === recipe.id);
  //   // If the recipe is not already in favorites, add it
  //   if (!isRecipeInFavorites) {
  //     setFavorites(prevFavorites => [...prevFavorites, recipe]);
  //   }
  // }

  return (
      <Router>
      <div className="window">
        <div>
          <h2 className="heading">DishDive</h2>
          <nav className="navbar">
            <Link to="/" className="navtitle">Home</Link>
            {/* <Link to="/search">Search</Link> */}
            {/* <Link to="/details">Details</Link> */}
            <Link to="/favorites" className="navtitle">Favorites</Link>
          </nav>
        </div>

        <Routes>
          <Route path="/" element={<Home setRecipe={setRecipe}/>} />
          <Route path="/search/:query" element={<Search favorites={favorites} setFavorites={setFavorites} recipe={recipe}/>} />
          <Route path="/details/:id" element={<Details favorites={favorites} setFavorites={setFavorites}/>} />
          <Route path="/favorites" element={<Favorites favorites={favorites} setFavorites={setFavorites}/>} />
        </Routes>

      </div>
        
      </Router>  
    
  )
}

function Home({setRecipe}) {
  
  const[query, setQuery] = useState("")

  function handleChange(event){
    setQuery(event.target.value)
  }

  async function handleSearch(event) {
    event.preventDefault();
    try{
      const response = await fetch(
        // `https://api.edamam.com/api/recipes/v2?type=any&q=${query}&app_id=818dbfb1&app_key=23bcde96abdc72c39c9debb07ce5d55a`
        `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY_1}&query=${query}`
      );
      const data = await response.json();
      console.log(data);
      setRecipe(data.results);
    }
    catch{
    
    }  
  }

  async function handleSearchI(event) {
    event.preventDefault();
    try{
      const response = await fetch(
        // `https://api.edamam.com/api/recipes/v2?type=any&q=${query}&app_id=818dbfb1&app_key=23bcde96abdc72c39c9debb07ce5d55a`
        `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${API_KEY_2}&ingredients=${query}`
      );
      const data = await response.json();
      console.log(data);
      setRecipe(data);
    }
    catch{
    
    }  
  }


  return (
        <div className="searchtabs">
          <div className="searchtab">
            <p className="statement">Search for recipe by dish name</p>
              <label className="search-input">
                <input type="text" value={query} onChange={handleChange} placeholder="Enter dish..."/>
                <button onClick={handleSearch}>
                  <Link to={`/search/${query}`} >
                      Search 
                  </Link>
                </button>
            </label>
            
          </div>
          <div className="searchtab">
            <p className="statement">Search for recipe by ingredient</p>
            <label className="search-input">
                  <input type="text" value={query} onChange={handleChange} placeholder="Enter ingredient..."/>
                  <button onClick={handleSearchI}>
                    <Link to={`/search/${query}`} >
                        Search 
                    </Link>
                  </button>
              </label>
          </div>
        </div>
  )
}



function Search({favorites, setFavorites, recipe}) {
    const {query} = useParams()
  // const[query, setQuery] = useState("")
  // const [recipe, setRecipe] = useState([])

  // function handleChange(event){
  //   setQuery(event.target.value)
  // }

  // async function handleSearch(event) {
  //   event.preventDefault();
  //   try{
  //     const response = await fetch(
  //       // `https://api.edamam.com/api/recipes/v2?type=any&q=${query}&app_id=818dbfb1&app_key=23bcde96abdc72c39c9debb07ce5d55a`
  //       `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY_2}&query=${query}`
  //     );
  //     const data = await response.json();
  //     console.log(data);
  //     setRecipe(data.results);
  //   }
  //   catch{
    
  //   }  
  // }
    const [isFavMap, setIsFavMap] = useState({});

    // Update isFavMap when recipe or favorites change
    useEffect(() => {
        const newIsFavMap = {};
        favorites.forEach(favRecipe => {
            newIsFavMap[favRecipe.id] = true;
        });
        setIsFavMap(newIsFavMap);
    }, [favorites]);

    async function handleAddToFavorites(r) {
        if (!isFavMap[r.id]) {
            setFavorites(prevFavorites => [...prevFavorites, r]);
            setIsFavMap(prevIsFavMap => ({
                ...prevIsFavMap,
                [r.id]: true
            }));
        }
    }

  let recipeList = null;

  if (recipe && recipe.length > 0) {
    recipeList = recipe.map((r) => 
      // <li key={r.id} className="recipe-item">
      //   <img src={r.image} alt={r.title} />
      //   <br />
      //   <Link to={`/details/${r.id}`}>{r.title}</Link>
      //   <button onClick={() => handleAddToFavorites(r)}>Add to Favorites</button> 
      //   {/* wrap each recipe with a Link passing the recipe ID as a parameter */}
      //   <br />
      // </li> 
      <div key={r.id} className="recipe-item">
        <img className="img" src={r.image} alt={r.title} />
        <br />
        <Link to={`/details/${r.id}`}>{r.title}</Link>
        <br></br>
        {
            !isFavMap[r.id] ? 
            <button onClick={() => handleAddToFavorites(r)}>
                Add to Favorites
            </button>
            :
            <button>Added</button>
        }
        
        <br />
      </div>
    )
  }
  
  
  return (
    <>
      {/* <label>
        <input type="text" value={query} onChange={handleChange} placeholder="Search for a recipe"/>
        <button onClick={handleSearch}>Search</button>
      </label> */}

      <div >
          <div>
            <p className="q">Results for {query}...</p>
          </div>
            
          <div className="recipe-grid">
            {recipeList}
          </div>
            

      </div>
    </>
  );
}

function Details({favorites, setFavorites}) {

  const {id} = useParams();
  
  const [recipeDetails, setRecipeDetails] = useState([])
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    async function handleDetails() {
      try {
        const response = await fetch(
            `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY_1}`
        );
        const data = await response.json();
        console.log(data);
        setRecipeDetails(data);
        // Check if the recipe is already in favorites
        setIsFav(favorites.some(favRecipe => favRecipe.id === data.id));
      }
      catch (error) {
        console.error("Error fetching recipe details:", error);
      }
    }
    handleDetails();
  }, [id, favorites]);

  
  async function handleAddToFavorites(recipe) {
    if (!isFav) {
      setFavorites(prevFavorites => [...prevFavorites, recipe]);
      setIsFav(true);
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
      <h1>Recipe</h1>
      <h2>{recipeDetails.title}</h2>
        {
            !isFav ? 
            <button onClick={() => handleAddToFavorites(recipeDetails)}>Add to Favorites</button>
            :
            <button>Added</button>
        }
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
    <div className="favorites-container">
        <h1 className="favorites-heading">Favorites</h1>
        <div className="recipe-grid">
            {favorites.map(recipe => (
                <div key={recipe.id} className="recipe-item">
                    <img src={recipe.image} alt={recipe.title} className="recipe-image" />
                    <div className="recipe-details">
                        <Link to={`/details/${recipe.id}`} className="recipe-title">{recipe.title}</Link>
                        <button onClick={() => removeFavorites(recipe.id)} className="remove-button">
                            Remove from Favorites
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
)
}
