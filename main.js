const API_KEY = '2122a544-6bf8-45ca-9134-e08c28c5bb1f'
const API_RANDOM = `https://api.thecatapi.com/v1/images/search?limit=3&apy_key=${API_KEY}`
const API_FAVORITE = `https://api.thecatapi.com/v1/favourites?apy_key=${API_KEY}`
const API_FAVORITE_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}?apy_key=${API_KEY}`
const API_UPLOAD = `https://api.thecatapi.com/v1/images/upload?apy_key=${API_KEY}`
const imgRandomCat = document.querySelectorAll('.random-cat')
const boxError = document.querySelector('#errors')
const buttonShowAnotherCats = document.querySelector('#showAnotherCats')
const buttonAddFavorite = document.querySelectorAll('.add-to-favorite')
const containFavorites = document.querySelector('#containFavorites')
const buttonShowFavoriteCats = document.querySelector('#showFavoriteCats')
let favoriteCats = false
const loadRandomCats = async () => {
    try {
        const res = await fetch(API_RANDOM)
        const data = await res.json()
        let i = 0
        buttonAddFavorite.forEach((box) => {
            imgRandomCat[i].src = data[i].url
            const idImage = data[i].id
            box.onclick = () => {
                saveFavoriteCats(idImage)
            }
            i ++
        })
    } catch (error) {
        boxError.innerHTML = `<b>Ha ocurrido un error:</b> ${error}`
        boxError.style.display = 'block'
    }
}
const loadFavoriteCats = async () => {
    try {
        favoriteCats = false
        const res = await fetch(API_FAVORITE, {
            method: 'GET',
            headers: {
                'x-api-key': API_KEY,
                'Content-Type': 'application/json',
            }
        })
        const data = await res.json()
        data.forEach( imgCat => {
            const div = document.createElement('div')
            const btText = document.createTextNode('❌')
            const button = document.createElement('button')
            const img = document.createElement('img')
            button.appendChild(btText)
            button.onclick = () => {
                deleteFavoriteCats(imgCat.id)
                loadFavoriteCats()
            }
            button.classList.add('remove-of-favorite')
            img.src = imgCat.image.url
            div.append(button, img)
            div.classList.add('imgCat')
            containFavorites.appendChild(div)
        })
        favoriteCats = true
    } catch (error) {
        boxError.innerHTML = `<b>Ha ocurrido un error:</b> ${error}`
        boxError.style.display = 'block'
    }
}
const saveFavoriteCats = async (id) => {
    const res = await fetch(API_FAVORITE, {
        method: 'POST',
        headers: {
            'x-api-key': API_KEY,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            image_id: id
        })
    })
    const data = await res.json()
    if (favoriteCats == true) {
        containFavorites.innerHTML = ''
        loadFavoriteCats()
    }
    (res.status !== 200)
        ? (
            boxError.innerHTML = `Hubo un error: ${res.status} ${data.message}`,
            boxError.style.display = 'block'
        )
        : null
}
const deleteFavoriteCats = async (id) => {
    const res = await fetch(API_FAVORITE_DELETE(id), {
        method: 'DELETE',
        headers: {
            'x-api-key': API_KEY,
        }
    })
    containFavorites.innerHTML = ''
    loadFavoriteCats()
}
loadRandomCats()
buttonShowAnotherCats.onclick = loadRandomCats
buttonShowFavoriteCats.onclick = () => {
    containFavorites.innerHTML = ''
    loadFavoriteCats()
}





const upLoadCatPhoto = async () => {
    const form = document.querySelector('#upLoadingForm')
    const formData = new FormData(form)

    console.log(formData.get('file'));

    const res = await fetch(API_UPLOAD, {
        method: 'POST',
        headers: {
            //'Content-Type': 'multipart/formData',
            'x-api-key': API_KEY
        },
        body: formData,
    })
    const data = await res.json()

    saveFavoriteCats(data.id)
}

const inputFile = document.getElementById('file')