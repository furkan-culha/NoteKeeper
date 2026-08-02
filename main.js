console.log(document.querySelector("bx-dots-horizontal-rounded"));

// ! Ay dizisi
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

//!Html den js e eleman çekilmesi
const addBox = document.querySelector(".add-box");
const popupBox = document.querySelector(".popup-box");
const popup = document.querySelector(".popup");
const closeBtn = document.querySelector("header i");
const form = document.querySelector("form");
const wrapper = document.querySelector(".wrapper");
const popupTitle =document.querySelector("#popup-title");
const popupButton =document.querySelector("#form-btn");


// ! Global scope'a sahip değişkenler
let notes = JSON.parse(localStorage.getItem("notes")) || []; // Eğer localStorage a notes keyine sahip bir eleman varsa bunu JSON.parse ie dönüştür ve notes'a ata ama eğer yoksa notes dizisini boş bir dizi olarak ata

let isUpdate; // güncelleme modundamı
let updateId; // güncellenecek elemanın id için

// Sayfa yüklendiği anda renderNotes fonksiyonunu çalıştır
document.addEventListener("DOMContentLoaded", renderNotes(notes));

// note içerisindeki menüyü aktif edlecek fonskiyon
function showMenu(item) {
  // Tıklanılan ... elemanının kapsam elemanına eriş
  //! Bir html elemanının kapsam elemanına erişmek için parentElement metodu kullanılır.
  const parentElement = item.parentElement;

  // parentElemente show classı ekle
  parentElement.classList.add("show");

  // show classı eklenerek aktif edilen menüyü pasife çek
  document.addEventListener("click", (e) => {
    // Tıklanılan eleman ... haricinde ve kapsam haricinde bie elemansa show classını kaldır
    if (e.target.tagName != "I" || e.target != item) {
      parentElement.classList.remove("show");
    }
  });
}

// note elamını silecek fonskiyon
function deleteNote(item) {
  // kullanıcıdan silme için onay al
  const response = confirm("Bu notu silme istediğinizden eminmisiniz");

  //Eğer silme işlemi onaylandıysa
  if (response) {
    //! Eğer bir elemanın birkaç defa kapsamına erişeceksek bunu parentElement metodu yerine closest metodu ile yapabiliriz.Bu metot(closest) seçicisi belirtilen elemana kısa yoldan erişmek için kullanılır.

    // Tıklanılan deleteIcon ın kapsayıcısına eriş
    const noteItem = item.closest(".note");

    // Erişilen noteItem ın data-id değerine eriş
    const noteId = Number(noteItem.dataset.id);

    // ıd si bilinen notu note dizisinden kaldır
    notes = notes.filter((note) => note.id != noteId);

    // Güncel note dizisine göre localStorage ı güncelle
    localStorage.setItem("notes", JSON.stringify(notes));

    // notes dizisinin final haline göre notları render et
    renderNotes(notes);
  }
}

// Note elemanını güncelleyecek fonksiyon
function editNote(item) {
  // tıklanıla note elemaına eriş
  const note = item.closest(".note");

  // note id eriş
  const noteId = parseInt(note.dataset.id);
  console.log(noteId);
  // id si bilinen notu note dizisimdem bul
  const foundNote = notes.find((note) => note.id === noteId);
  console.log(foundNote);
  // popu ı aktif etmek için popupbox ve popup a show classı ekle (classList)
  popupBox.classList.add("show");
  popup.classList.add("show");

  // popup aktif edildiğinde arka planda yer alan elemanların kaydıırlmasını engelleme
  document.body.style.overflow = "hidden";

  //form içerisindeki elemanlara note'un değerlerini ata
  form[0].value = foundNote.title;
  form[1].value = foundNote.description;

  // Güncelleme modu için gerekli değişkenlere atama yap
  isUpdate = true;
  updateId = noteId;

// popup içerisindeki title ve button'ın içeriklerini güncelle
  popupTitle.textContent = "Update Note";
  popupButton.textContent = "Update";
}

// wrapper elemanına bir olay izleyicisi ekle

wrapper.addEventListener("click", (e) => {
  // ... elemanına tıkladnıysa menüyü aktif et

  if (e.target.classList.contains("bx-dots-horizontal-rounded")) {
    // Note ile alakalı yönrtimi sağlayan menüyü aktif et
    showMenu(e.target);
  }

  // delete-icon classına sahip elemana tıklandıysa
  else if (e.target.classList.contains("delete-icon")) {
    deleteNote(e.target);
  }

  //edit-icon a sahip elemana tıklandıysa
  else if (e.target.classList.contains("edit-icon")) {
    editNote(e.target);
  }
});

// !popup ı aktif etmek için addBox elemanına olay izleyicisi ekle
addBox.addEventListener("click", () => {
  // popu ı aktif etmek için popupbox ve popup a show classı ekle (classList)
  popupBox.classList.add("show");
  popup.classList.add("show");

  // popup aktif edildiğinde arka planda yer alan elemanların kaydıırlmasını engelleme
  document.body.style.overflow = "hidden";
});

// popup ı pasif hale gtirmek için closeBtn elemanına olay izleyicisi(addEventListener) ekle
closeBtn.addEventListener("click", () => {
  //Popup ı pasif hale getirmek için popup ve popupBox dan show elemanını çıkar
  popupBox.classList.remove("show");
  popup.classList.remove("show");

  //popup pasi haline gtirildiğinde arka planda çalışan elamanların kaydırılmasını eski haline getir
  document.body.style.overflow = "auto";

// Popup kapatıldığında formun içerisini temizle
 form.reset();
   
 //  Popup eski haline çevir
popupTitle.textContent ="New Note";
popupButton.textContent ="Add";
isUpdate = false;
updateId = null;
});

//!Formun gönderilmesini izle
form.addEventListener("submit", (e) => {
  //form gönderildiğinde default özellik olarak sayfa yenilenir.Bunu engellemek için event parametresi içindeki preventDefault metodu kullanılır.
  e.preventDefault();

  //form içeriisndeki title ve description elemanlarına eriş
  const titleInput = e.target[0];
  const descriptionInput = e.target[1];

  // titleInput ve descriptionInput elemanlarının değerlerine eriş
  const title = titleInput.value;
  const description = descriptionInput.value;

  //Eğer title ve description yoksa kullanıcıya uyarı ver
  if (!title || !description) {
    alert("Title ve description kısımları boş bırakılamaz");

    //Kullanıcıya uyarı verildiyse fonksiynu durdur
    return;
  }

  // Notun gönderidiği güncel tarih verisine erişmek için ilk olarak tarih objesinden örnek al sonrasında bu obje içerisinde yer alan metotlar ile day,month,year ve id değerlerine eriş
  const date = new Date();

  const day = date.getDate();
  const month = date.getMonth();
  const updateMonth = months[month];
  const year = date.getFullYear();
  const id = date.getTime();

  //! Popup güncelleme modunda mı ekleme modundamı
  if (isUpdate) {
    // notes dizisi içerisinde güncellencek elemanın sırasını bul
    const updateIndex = notes.findIndex((note) => note.id == updateId);

    // Bulunan index deki elemanı notes dizisi içerisinde güncelle

     notes[updateIndex] = {
      title,
      description,
      date: `${updateMonth} ${day},${year} `,
      id,
    };

//  Popup eski haline çevir
popupTitle.textContent ="New Note";
popupButton.textContent ="Add";
isUpdate = false;
updateId = null;
  }
   else {
    // Popup içeriisnde erişilen değerler ve tarih objesi içeriisnden elde edilen değerler ile eklenecek note elemanı için bir obje oluştur
    let noteItem = {
      title,
      description,
      date: `${updateMonth} ${day},${year}`,
      id,
    };
    // Formun gönderilmesi ile oluşturukan noteItem ı notes dizisine ekle
    notes.push(noteItem);
  }

  //LocalStorage a kayıt yap
  localStorage.setItem("notes", JSON.stringify(notes));

  // Formu temizle
  // titleInput.value = " ";
  // descriptionInput.value = " ";

  form.reset();

  // Popup'ı pasif etmek için popup ve popupBox'dan show classını kaldır
  popupBox.classList.remove("show");
  popup.classList.remove("show");

  // Popup pasif edildiğinde arka planda yer alan elemanların kaydırılmasını eski haline çevir
  document.body.style.overflow = "auto";
  renderNotes(notes);
   popupTitle.textContent = "New Note";
  popupButton.textContent = "Add";
  isUpdate = false;
  updateId = null;
});

// Notları arayüze render edecek fonksiyon
function renderNotes(notes) {
  // Bu fonksiyon ne yapacak
  // notes dizisinde yer alan her note elemanı için bir arayüz elemanı render etmeli

  //! renderNotes fonksiyonu her çalıştırıldığında bizim için her seferinde önce eklenen note'ları tekrar render ediyor.Bu durumu düzeltmek için her renderNotes fonksiyonu çalışltıığında  arayüzdeki .notes classına sahip tüm elemanları kaldır.
  document.querySelectorAll(".note").forEach((noteItem) => noteItem.remove());

  //! Bir arayüz elemanını ekrandan kaldırmak için remove metodu kullanılır.Bu metot kaldırılmak istenen elemanın adından sonra .remove() şeklinde kullanılır.

  //! notes dizisi içerisindeki her eleman için bir note html'i oluştur

  notes.forEach((note) => {
    let noteHtml = `<div class="note" data-id=${note.id}>
        <div class="details"> <!-- Bu div'i eklemeniz gerekiyor -->
          <h2>${note.title}</h2>
          <p>${note.description}</p>
        </div>
        <div class="bottom">
          <p>${note.date}</p>
          <div class="settings">
            <i class="bx bx-dots-horizontal-rounded"></i>
            <ul class="menu">
              <li class="edit-icon"><i class="bx bx-edit"></i>Edit</li>
              <li class="delete-icon"><i class="bx bx-trash"></i>Delete</li>
            </ul>
          </div>
        </div>
      </div>`;

    // Oluştuurulan html elemanını arayüze ekle
    // !Eğer bir html elemanını bir html elemanının öncesine veya sonrasına eklemek için insertAdjacentHTML metodu kullanılır.Bu metot hangi elemana göre ekleme yapılacağını belirtmemizi ve bu eklemenin önce veya sonramı ekleneceğin belitrmemizi ister
    addBox.insertAdjacentHTML("afterend", noteHtml);
  });
}
