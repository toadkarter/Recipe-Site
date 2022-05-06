import { Splide, SplideSlide } from '@splidejs/react-splide';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import '@splidejs/splide/dist/css/splide.min.css';
import {Link} from 'react-router-dom';

function Popular() {

  // State is like a variable that you can change on your page. setPopular here is like the setter in OOP. The empty array is just saying that there are no default values, presumably, and also that "popular" is going to be an array.
  const [popular, setPopular] = useState([]);


  // This will, by default, run when the component gets mounted. The empty array I think is there to add extra variations of what is going to happen if something in the App changes. 
  useEffect(() => {
    getPopular();
  },[]);

  // The reason this is async is because we want to wait until the data is loaded up before showing it. This will run first I guess? I should probably do this for all my REST API calls.
  const getPopular = async () => {

    // Here we are checking if there's anything in local storage
    const check = localStorage.getItem('popular');

    if (check) {
      setPopular(JSON.parse(check));
    } else {
      const api = await fetch(`https://api.spoonacular.com/recipes/random?apiKey=${process.env.REACT_APP_API_KEY}&number=9`);
      
      // This will create a json file from the api call
      const data = await api.json();

      localStorage.setItem('popular', JSON.stringify(data.recipes));

      // This will put in the relevant data from the JSON file into the popular variable.
      setPopular(data.recipes);
    }

  }

  // From what I understand, 'map' is basically just a foreach loop. Remember to add a key to your JSON objects so that React doesn't have a freakout
  return (
    <div>
      <Wrapper>
        <h3>Popular Picks</h3>

        {/* Splide means the entire carousel */}
        <Splide options={{
          perPage: 4,
          arrows: false,
          pagination: false,
          drag: 'free',
          gap: '5rem'
        }}>
          {popular.map((recipe) => {
            return (
              // SplideSlide means each bit on the carousel
              <SplideSlide key={recipe.id}>
                <Card>
                  <Link to={'/recipe/'+recipe.id}>
                    <p>{recipe.title}</p>
                    <img src={recipe.image} alt={recipe.title} />
                    <Gradient />
                  </Link>
                </Card>
              </SplideSlide>    
            );
          })}
        </Splide>
      </Wrapper>
    </div>
    );
}

// This seems to be a way of injecting CSS into your components
const Wrapper = styled.div`
  margin: 4rem 0rem;
`
const Card = styled.div`
  min-height: 25rem;
  border-radius: 2rem;
  overflow: hidden;
  position: relative;

  img{
    border-radius: 2rem;
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  p {
    position: absolute;
    z-index: 10;
    left: 50%;
    bottom: 0%;
    transform: translate(-50%, 0%);
    color: white;
    width: 100%;
    text-align: center;
    font-weight: 600;
    font-size: 1rem;
    height: 40%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`

const Gradient = styled.div`
  z-index: 3;
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.5));

`

export default Popular