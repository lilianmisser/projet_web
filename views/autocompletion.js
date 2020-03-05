const search = document.getElementById("search");
const matchList = document.getElementById("matches");

const searchMatch = async (input) => {    
  let matches = movies_name.filter(movie =>{
    const regex = new RegExp("^"+input, 'gi');
    return movie.match(regex);
  });
  
  if(input.length === 0){
    matches = [];
    matchList.innerHTML = "";
  }
  console.log(matches);
  showMatches(matches);
};

const showMatches = matches => {
  if(matches.length > 0){
    const html = matches.map(match =>
      `<div class="card">
      <div class="card-img">
          <img src=${movies_path[movies_name.indexOf(match)]} alt="Movie poster">
      </div>
      <div class="card-body">
          <p class="card-title">
            ${match}
          </p>
          <a href="/movies/${movies_id[movies_name.indexOf(match)]}">Go to</a>
      </div>
      <div>
      `).join("");
  
    matchList.innerHTML = html;
  }
};

search.addEventListener("input", () => searchMatch(search.value));