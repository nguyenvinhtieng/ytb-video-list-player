let form = document.querySelector("#form")
let list = document.querySelector("#list")
let url = document.querySelector("#url")
let title = document.querySelector("#title")
let type = document.querySelector("#type")
let ytb = document.querySelector("#ytb iframe")

let data = [
    {
        id: 1,
        url: "https://www.youtube.com/watch?v=ixNLxzcfnbk",
        title: "Rolling down",
        type: "youtube"
    },
    {
        id: 2,
        url: "https://www.youtube.com/watch?v=yyXHS2b-lCU",
        title: "Sống cho hết đời thanh xuân",
        type: "youtube"
    }
]
let currentItem = null

function addEvent() {
    let items = document.querySelectorAll(".js-item")
    items.forEach((item, index) => {

        let deleteBtn = item.querySelector(".delete")
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation()
            let id = item.getAttribute("data-id")
            data = data.filter((item) => {
                return item.id != id
            })
            renderData()
        })

        item.addEventListener("click", (e) => {
            let id = item.getAttribute("data-id")
            currentItem = data.find((item) => {
                return item.id == id
            })
            play()
        })
    })
}

function play() {
    console.log(currentItem)
    if(currentItem.type == "youtube") {
        // get id from url
        let id = currentItem.url.split("v=")[1]
        // set src for iframe
        let finalUrl = "https://www.youtube.com/embed/" + id + "?autoplay=1"
        ytb.setAttribute("src", finalUrl)
    }

    // check data to set active
    let items = document.querySelectorAll(".js-item")
    items.forEach((item, index) => {
        item.classList.remove("active")

        if(item.getAttribute("data-id") == currentItem.id) {
            item.classList.add("active")
        }
    })
}

function renderData() {
    list.innerHTML = ""
    data.forEach((item, index) => {
        list.innerHTML += `
        <li class="js-item item" data-id="${item.id}">
            ${item.title}
            <div class="delete"><ion-icon name="close"></ion-icon></div>
        </li>`
    })

    addEvent()
}


form.addEventListener("submit", (e) => {
    e.preventDefault()
    let urlVal = url.value
    let titleVal = title.value
    let typeVal = type.value
    $('#modalAdd').modal('hide')
    data.push({
        id: Math.random(),
        url: urlVal,
        title: titleVal,
        type: typeVal
    })
    url.value = ""
    title.value = ""
    type.value = ""
    renderData()
})

renderData()

if(data.length > 0) {
    currentItem = data[0]
    play()
}