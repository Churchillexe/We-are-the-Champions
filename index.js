
//database
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://dbrealtime-f11bb-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const testimonialsInDB = ref(database,"testimonies")


//DOM
const endorsementinputEl = document.getElementById("endorsement-input")
const fromInputEl = document.getElementById("from-input")
const toInputEl = document.getElementById("to-input")
const publishBtn = document.getElementById("publish-btn")
const endorsementsListul = document.getElementById("endorsements-list")




//main functions
publishBtn.addEventListener("click", function() {
    let inputValue = endorsementinputEl.value
    let toValue = toInputEl.value
    let fromValue = fromInputEl.value
    const Inputs = {
        content: inputValue,
        sender: fromValue,
        receiver: toValue,
        likes: 0,
        isLikesAdded: true
    }
    push(testimonialsInDB, Inputs)
    clearInputFieldElement()
})

onValue(testimonialsInDB, function(snapshot) {
    if(snapshot.exists()) {
        clearUl()

        let arrayList = Object.entries(snapshot.val())
        console.log(arrayList)
        for (let i = 0; i < arrayList.length; i++){
            let currentItem = arrayList[i]
            console.log(currentItem)
            appendEndorsement(currentItem)
            
        }
    } else{
        endorsementsListul.innerHTML = "Be the first to add an endorsement!"
    }
})


//refactored functions
function clearInputFieldElement() { 
    endorsementinputEl.value = ""
}

function clearUl(){
    endorsementsListul.innerHTML = ``
}

function appendEndorsement(item) {
    let idFromDB = item[0]
    let objectFromDB = item[1]
    let itemValue = 
   `<h4>To ${objectFromDB.receiver}</h4>
   <p>${objectFromDB.content}</p>
   <div class="li-btm-container">
   <h4>From ${objectFromDB.sender}</h4>
        <div id="like-container">
        <span class="like-btn" >🖤</span>
        <span class="likes-count" data-likes=${objectFromDB.likes}>${objectFromDB.likes}</span>
        </div>
    </div>`
   
    
    const newEl = document.createElement("li")
    newEl.innerHTML = itemValue
    endorsementsListul.append(newEl)

    const likeBtn = newEl.querySelector(".like-btn");
    const likesCountEl = newEl.querySelector(".likes-count");
    toName(likeBtn,idFromDB,likesCountEl)

}

function toName (btnEl,id,likes,) {
    btnEl.addEventListener("click", function() {
        let heartContent = btnEl.textContent
        let boolean = true
        const exactLocationOfItemInDB = ref(database, `testimonies/${id}/likes`)
        const exactLocationOfBooleanInDB = ref(database, `testimonies/${id}/isLikesAdded`)
        let likesCount = parseInt(likes.getAttribute("data-likes"));
        if(heartContent === "🖤" ){

            likesCount++
            set(exactLocationOfItemInDB, likesCount)
            set(exactLocationOfBooleanInDB, boolean)
            }
        
    });
}