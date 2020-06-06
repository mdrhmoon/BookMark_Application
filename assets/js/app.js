// Declaring BookMark Class
class WebSite{
    constructor(name, siteUrl){
        this.name = name;
        this.siteUrl = siteUrl;
    }
}


// Declaring UI Control Class
class IndexController{
    static monthsOfYear = [ 
        "January", "February", "March", "April", "May", "June", "July", "August", 
        "September", "October", "November", "December"
    ];

    static daysOfWeek = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ];


    constructor(){}

    // Method Gonna Call After Initializing DOMContent
    static initializeDOMContent(){
        IndexController.fetchBookmarks();
        setInterval(IndexController.getDateTime, 1000);
    }

    
    // Start Of Digital Clock Section
    static getDateTime(){
        //Get Date
        const dateObj = new Date();
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth();
        const day = dateObj.getDay();

        let date = dateObj.getDate();
        if(date < 10){
            date = '0' + date;
        }

        let hour = dateObj.getHours();
        let xx = 'AM';
        if(hour >= 12){
            hour = hour - 12;
            xx = 'PM';
        }
        if(hour < 10){
            hour = '0' + hour;
        }
    
        let minute = dateObj.getMinutes();
        if(minute < 10){
            minute = '0' + minute;
        }
    
        let seconds = dateObj.getSeconds();
        if(seconds < 10){
            seconds = '0' + seconds;
        }
    
        document.querySelector('#clock').innerHTML = 
            `<h1 class="text-info" style="text-shadow: 2px 2px 4px #000000;">
                ${date} ${IndexController.monthsOfYear[month]}, ${year} ${IndexController.daysOfWeek[day]} ${hour}:${minute}:${seconds} ${xx}
            </h1>`;
    }
    

    // Add New BookMark To List
    static addWebSite(site){
        const ul = document.getElementById('bookMarkList');

        const li = document.createElement('li');
        li.className = "list-group-item";
        li.innerHTML = `
            <a class="btn btn-link btn-sm" target="_blank" href="https://${site.siteUrl}">
                <span class="text-info">${site.name}</span> url: https://${site.siteUrl}
            </a>
            <input type="hidden" value="${Store.getWebSites().length - 1}"/>
            <button type="button" class="btn btn-danger btn-sm delete">X</button>`;

        ul.appendChild(li);
    }


    // Delete BookMark From List
    static deleteWebSite(element){
        // Getting the index of the item
        const index = element.previousElementSibling.value;
        
        //Remove Index from the localStorage
        Store.removeWebSite(index);
        element.parentElement.remove();
    }


    //Fetch BookMarks
    static fetchBookmarks(){
        let bookmarks = Store.getWebSites();
        // Getting an ul element
        const ul = document.getElementById('bookMarkList');

        bookmarks.forEach((site, index) => {
            // Creating a li elemnet
            const li = document.createElement('li');
            li.className = "list-group-item";
            li.innerHTML = `
                <a class="btn btn-link btn-sm" target="_blank" href="https://${site.siteUrl}">
                    <span class="text-info">${site.name}</span> url: https://${site.siteUrl}
                </a>
                <input type="hidden" value="${index}"/>
                <button type="button" class="btn btn-danger btn-sm delete">X</button>`;

            ul.appendChild(li);
        });
    }


    //Clear Form
    static clearBookmarkForm(){
        document.getElementById('siteName').value = '';
        document.getElementById('siteUrl').value = '';
    }
}



// Local Storage Manipulation Class
class Store{
    // get BookMarkList From Local Storage;
    static getWebSites(){
        let bookmarks;

        if(localStorage.getItem('MYBOOKMARK') === null){
            bookmarks = [];
        }
        else{
            bookmarks = JSON.parse(localStorage.getItem('MYBOOKMARK'));
        }

        return bookmarks;
    }


    // Add New WebSite to localStorage
    static addWebSites(webSite){
        const bookmarks = Store.getWebSites();

        let tempMarks = bookmarks.filter(site => {
            return site.siteUrl === webSite.siteUrl;
        });

        if(tempMarks.length !== 0){
            alert('The Url Already Exists.');
            return ;
        }

        bookmarks.push(webSite);
        localStorage.setItem('MYBOOKMARK', JSON.stringify(bookmarks));
    }


    // delete from localStorage
    static removeWebSite(index){
        const bookmarks = Store.getWebSites();
        bookmarks.splice(index, 1);

        localStorage.setItem('MYBOOKMARK', JSON.stringify(bookmarks));
    }
}



/****************
*   Event Sections
*/

// On Load Event
document.addEventListener("DOMContentLoaded", (e) => { 
    IndexController.initializeDOMContent();
});

//Delete Bookmark
document.querySelector('#bookMarkList').addEventListener('click', (e) => { 
    IndexController.deleteWebSite(e.target); 
});


// Start of Add New WebSite To BookMark
document.getElementById('myForm').addEventListener('submit', (e) => {
    // preventing Form From Submitting
    e.preventDefault();

    const name = document.getElementById('siteName').value;
    const url = document.getElementById('siteUrl').value;

    if(name =='' || name == null || name == undefined || url =='' || url == null || url == undefined){
        alert('Please fill in all fields.');
        return;
    }

    const webSite = new WebSite(name, url);
    Store.addWebSites(webSite);
    IndexController.addWebSite(webSite);

    alert('Added To Bookmark.');
    document.getElementById('modalClose').click();
});
// End of Add New WebSite To BookMark
