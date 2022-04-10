import { useEffect, useState } from "react";
import "./App.css";
import Axios from "axios";
function App() {
  const [foodName, setFoodName] = useState("");
  const [daySinceIAte, setDays] = useState(0);
  const [foodList, setFoodList] = useState([]);
  const [newFoodName, setNewFoodName] = useState("");

  useEffect(() => {
    Axios.get("http://localhost:3001/read").then((response) => {
      setFoodList(response.data);
    });
  }, []);

  const addToList = () => {
    Axios.post("http://localhost:3001/insert", {
      foodName: foodName,
      daySinceIAte: daySinceIAte,
    });
  };
  const updateFoodName = (id) => {
    Axios.put("http://localhost:3001/update", {
      id: id,
      newFoodName: newFoodName,
    });
  };

  const deleteFood = (id) => {
    Axios.delete(`http://localhost:3001/delete/${id}`);
  };
  return (
    <div className="App">
      <h1>CRUD with Mern</h1>
      <label>Food Name :</label>
      <input
        type="text"
        onChange={(event) => {
          setFoodName(event.target.value);
        }}
      />
      <label>days Since I Ate :</label>
      <input
        type="number"
        onChange={(event) => {
          setDays(event.target.value);
        }}
      />
      <button onClick={addToList}>Add To List</button>
      <h2> Food List : </h2>
      {foodList.map((val, key) => {
        return (
          <div key={key} className="food">
            <h3>{val.foodName}</h3>
            <h3>{val.daySinceIAte}</h3>
            <input
              type="text"
              placeholder="New food name.."
              onChange={(event) => {
                setNewFoodName(event.target.value);
              }}
            />
            <button onClick={() => updateFoodName(val._id)}> update </button>

            <button onClick={() => deleteFood(val._id)}>delete</button>
          </div>
        );
      })}
    </div>
  );
}

export default App;
