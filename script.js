// https://api.jikan.moe/v4/top/anime   (Jikan API)

const formEle = document.querySelector('.js-search-form');

formEle.addEventListener('submit', async (event) => {
    event.preventDefault()
    const search = formEle.elements.query.value;
    await fetchAnimeData(search)
    formEle.reset()
    document.querySelector('.js-anime-top').innerHTML = '';
    document.querySelector('.js-anime-pop').innerHTML = '';
})

const fetchAnimeData = async (search, limit = 15) => {
    try {
        const config = { params: { q: search, limit: limit } }
        const res = await axios.get(`https://api.jikan.moe/v4/anime`, config)
        const animeData = res.data.data;

        allAnime = animeData
        displayAnime(allAnime, 'Search Results', '#anime-list')
    } catch (err) {
        console.log("Error fetching anime data:", err);
    }  
}

const fetchShowAnimeOnload = async () => {
    try {
        const [topAnimeRes, popularAnimeRes] = await Promise.all([
            axios.get(`https://api.jikan.moe/v4/top/anime`, { params: { limit: 5 } }),
            axios.get(`https://api.jikan.moe/v4/top/anime`, { params: { limit: 5, filter: 'bypopularity' } })
        ]);

        const topAnimeData = topAnimeRes.data.data;
        const popAnimeData = popularAnimeRes.data.data;


        displayAnime(topAnimeData, 'TOP TRENDING NOW', '.js-anime-top')
        displayAnime(popAnimeData, 'MOST POPULAR','.js-anime-pop')

    } catch (errt) {
        console.log("Error fetching top anime data", errt);
    }
   
}

const fetchAllTopAnime = async () => {
    try {
        const res = await axios.get(`https://api.jikan.moe/v4/top/anime`);
        const allTopAnime = res.data.data;

        displayAnime(allTopAnime, 'ALL TOP TRENDING NOW', '.js-anime-top')
    } catch (errat) {
        console.log("Error fetching all top anime data", errat);
    }
    
}

const fetchAllPopAnime = async () => {
    try {
        const res = await axios.get(`https://api.jikan.moe/v4/top/anime`, { params: { filter: 'bypopularity' } });
        const allPopAnime = res.data.data;

        displayAnime(allPopAnime, 'ALL MOST POPULAR NOW', '.js-anime-pop')
    } catch (errap) {
        console.log("Error fetching all pop anime data", errap);
    }
    
}

const displayAnime = (animeList, sectionTitle, containerClass) => {
    const animeContainer = document.querySelector(containerClass);
    animeContainer.innerHTML = `
    <h3 class="section-title js-section-title">${sectionTitle}</h3>`;

    if (animeList.length === 0) {
        animeContainer.innerHTML = '<p>No result found.</p>';
        return;
    }

    animeList.forEach((anime) => {
        const animeItem = document.createElement('div');
        animeItem.classList.add('anime-item');

        let score = anime.score !== null ? anime.score : 'N/A' ;
        animeItem.innerHTML = 
        `
         <div class="anime-image"><img src="${anime.images.jpg.image_url}" class="js-anime-image" alt="${anime.title}"></div>
         <div class="anime-title""><h3>${anime.title}</h3></div>
         <div class="anime-score"><p>Score: ${score}</p></div>`;
        
         animeContainer.appendChild(animeItem);  

         const animeImage = animeItem.querySelectorAll('.anime-image img');
         animeImage.forEach((image) => {
            image.addEventListener('click',() => {
                showAnimeModal(anime)
            });
         })
    });
    
    const clickAnime = document.querySelectorAll('.js-section-title')
    clickAnime.forEach((title) => {
        title.addEventListener ('click', () => {
            if (title.textContent.includes('TOP')) {
                fetchAllTopAnime()
            } else if (title.textContent.includes('POPULAR')) {
                fetchAllPopAnime()
            }
            formEle.reset();
            document.querySelector('.js-anime-top').innerHTML = '';
            document.querySelector('.js-anime-pop').innerHTML = '';
        })
        
    })

    const showAnimeModal = (anime) => {
        const modal = document.getElementById('animeModal');
        const modalBody = modal.querySelector('.js-modal-body');

        if (!anime) {
            modalBody.innerHTML = `<p>Could not load anime details. Please try again later.</p>`
            modal.style.display = 'flex'
        }

        modalBody.innerHTML = `
        <h2>${anime.title}</h2>
        <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
        <p><strong>Score:</strong> ${anime.score}</p>
        <p><strong>Episodes:</strong> ${anime.episodes}</p>
        <p><strong>Synopsis:</strong> ${anime.synopsis}</p>`;
        
        modal.style.display = 'flex';
    
        const closeButton = modal.querySelector('.close');
        closeButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        })
        
    }
}

window.onload = fetchShowAnimeOnload;