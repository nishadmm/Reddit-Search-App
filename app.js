// Variables
const searchContainer = document.getElementById('search-container'),
  searchInput = document.getElementById('search-input'),
  loader = document.getElementById('loader-container');

// Listner for search btn
searchContainer.addEventListener('submit', e => {

  // Input values
  const searchTerm = searchInput.value,
    sortBy = document.querySelector('input[name="sortby"]:checked').value,
    limit = document.querySelector('select').value;

  // Check input values
  if (searchTerm === '') {
    // Set loader
    loader.style.display = 'flex';

    setTimeout(() => {
      loader.style.display = 'none';
      // Show alert
      showAlet('Please enter the search term...', 'alert');
    }, 2000);

  } else {

    // Clear input value
    searchInput.value = '';

    // Remove grid for loader
    if (document.querySelector('.grid')) {
      document.querySelector('.grid').remove();
    }

    // Show loader
    if (!document.querySelector('.grid')) {
      loader.style.display = 'flex';
    }

    // Get 
    fetch(`https://www.reddit.com/search.json?q=${searchTerm}&sort=${sortBy}&limit=${limit}`)
      .then(res => res.json())
      .then(data => data.data.children.map(data => data.data))
      .then(posts => {

        // Store into LS
        localStorage.setItem('posts', JSON.stringify(posts));
        localStorage.setItem('searchTerm', JSON.stringify(searchTerm));

        // Get from LS
        const dataFromLS = JSON.parse(localStorage.getItem('posts')),
          searchTermFromLS = JSON.parse(localStorage.getItem('searchTerm'));

        // Show result
        ShowResult(dataFromLS, searchTermFromLS);
      })

      .catch(err => console.log(err));
  }
  e.preventDefault();
});

// Listner for clear btn
document.querySelector('.clear-btn').addEventListener('click', (e) => {
  if (document.querySelector('.grid')) {
    if (confirm("Are You Sure ?")) {
      // Show loader
      loader.style.display = 'flex';
      // Time out
      setTimeout(() => {
        loader.style.display = 'none';
        localStorage.removeItem('posts');
        showDataFromLS();
        document.getElementById('search-term').style.visibility = 'hidden';
      }, 2000);
    }
  }

  e.preventDefault();
});

// Show Results
function ShowResult(dataFromLS, searchTermFromLS) {

  // Hide loader
  loader.style.display = 'none';

  // Search term show
  document.getElementById('search-term').style.visibility = 'visible';
  document.getElementById('search-term').textContent = `Result By : ${searchTermFromLS}`;

  let output = '<div class="grid">'

  // Loop through posts
  dataFromLS.forEach((post) => {

    // Image 
    let image = post.preview ? post.preview.images[0].source.url : `https://1000logos.net/wp-content/uploads/2017/05/emblem-Reddit-Logo.jpg`;

    output += `<div class="card">
    <img src="${image}" alt="post-image" class="post-image">
    <div class="post-title">${post.title}</div>
    <div class="post-content">${truncate(post.selftext, 200)}</div>
    <div class="btns">
      <a href="http://www.reddit.com${post.permalink}" class="get-post btn" target="_blank" ><i class="fas fa-mail-bulk"></i> See Post</a>
      <a href="https://www.reddit.com/user/${post.author}" class="get-profile btn" target="_blank" ><i class="fas fa-user-circle"></i> See Profile</a>
    </div>
    <div class="badges">
      <span class="badge badge-primary">Score: <div>${post.score}</div></span>
      <span class="badge badge-secondary">Subreddit: <div>${post.subreddit}</div></span>
      <span class="badge badge-third">Awards: <div>${post.all_awardings.length}</div></span>
    </div>
  </div>`
  })
  output += '</div>'
  document.getElementById('results').innerHTML = output;
}

// Show alert
function showAlet(msg, className) {
  // Remove alert if there is any
  removeAlert();
  // create div
  const div = document.createElement('div');
  // Add class
  div.className = className;
  // Add text
  div.appendChild(document.createTextNode(msg));
  // Get parent
  const searchContainer = document.getElementById('search-container');
  // Get before element
  const formContainer = document.getElementById('form-container');
  // Insert
  searchContainer.insertBefore(div, formContainer);

  // Time out 
  setTimeout(() => {
    removeAlert();
  }, 3000);

  function removeAlert() {
    if (document.querySelector('.alert')) {
      document.querySelector('.alert').remove();
    }
  }
}

// Truncate content 
function truncate(text, limit) {
  const endingIndex = text.indexOf(' ', limit);
  const output = endingIndex === -1 ? text : text.substring(0, endingIndex);
  return output
}

// Get data from LS and Show in UI
function showDataFromLS() {
  if (localStorage.getItem('posts')) {

    // Get from LS
    const dataFromLS = JSON.parse(localStorage.getItem('posts')),
      searchTermFromLS = JSON.parse(localStorage.getItem('searchTerm'));

    // Show in UI
    ShowResult(dataFromLS, searchTermFromLS);
  } else {
    document.getElementById('results').innerHTML = '';
  }

}

showDataFromLS();