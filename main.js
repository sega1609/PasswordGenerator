const noteTitle = document.querySelector('#note_title')
const noteBody = document.querySelector('#note_body')
const noteCreate = document.querySelector('#note_create')
const notesContainer = document.querySelector('.notes-container')


const dataManager = {
    get() {
        return JSON.parse(localStorage.getItem('notes'))
    },
    add(note) {
        let notes = this.get()
        notes.push(note)
        localStorage.setItem('notes', JSON.stringify(notes))
        renderNotes(notes)
    },
    remove(note) {
        let notes = this.get()
        notes.splice(notes.indexOf(note), 1)
        localStorage.setItem('notes', JSON.stringify(notes))
        renderNotes(notes)
    },
    save() {
        localStorage.setItem('notes', JSON.stringify(notes))
        renderNotes(notes)
    },
    setColor(note, color) {
        let notes = this.get()
        let note_index = notes.indexOf(note)
        notes[note_index].color = color
        localStorage.setItem('notes', JSON.stringify(notes))
        renderNotes(notes)
    },
}

let notes = dataManager.get()

if (!Array.isArray(notes)) {
    localStorage.setItem("notes", JSON.stringify([]))
    notes = dataManager.get()
}

const renderNotes = (notes) => {
    notesContainer.textContent = ''
    notes.forEach((note) => {
        const noteDiv = document.createElement('div')
        noteDiv.className = 'note'
        noteDiv.id = note.id
        noteDiv.setAttribute("data-background", note.color)
        noteDiv.stylebackgroundColor = note.color
        noteDiv.insertAdjacentHTML('beforeend', `
            <h2 class="note-title_value">${note.title}</h2>
            <p class="note-body_value">${note.body}</p>
            <h5>${note.dateofcreate}</h5>

            <div class="note_close">&times;</div>
            <div class="note_edit">&#9998;</div>
            <div class="note_save" style="display: none;">&#128190;</div>
            <div class="note_colors">
                <div class="color red" data-color="#ff4a4a"></div>
                <div class="color green" data-color="#22d96c"></div>
                <div class="color white" data-color="#fff"></div>
                <div class="color blue" data-color="#271cff"></div>
                <div class="color orange" data-color="#ff8a19"></div>
            </div>

        `)
        notesContainer.insertAdjacentElement('beforeend', noteDiv)
    })
}

renderNotes(notes)
noteCreate.addEventListener('click', () => {
    const datenow = new Date()

    const note = {
        id: notes.length,
        title: noteTitle.value,
        body: noteBody.value,
        dateofcreate: `${datenow.getDate()}-${datenow.getMonth() + 1}-${datenow.getFullYear()}`,
        color: ''
    }


    dataManager.add(note)
    noteTitle.value = ''
    noteBody.value = ''

})

notesContainer.addEventListener('click', (event) => {
    const target = event.target
    const note = target.closest('.note')

    const btnEdit = note.querySelector('.note_edit')
    const btnSave = note.querySelector('.note_save')
    const titleField = note.querySelector('.note-title_value')
    const bodyField = note.querySelector('.note-body_value')

    const noteColors = note.querySelector('.note_colors')
    noteColors.addEventListener('click', function changeColor(e) {
        if (e.target.classList.contains('color')) {
            console.log(e.target.dataset.color);

            note.style.backgroundColor = e.target.dataset.color;
            note.setAttribute("data-background", e.target.dataset.color)
        }
    })

    if (note && target.classList.contains('note_close')) {
        dataManager.remove(note)
    }

    if (note && target.classList.contains('note_edit')) {
        btnEdit.style.display = 'none'
        btnSave.style.display = 'block'

        titleField.contentEditable = true
        bodyField.contentEditable = true
    }
    if (note && target.classList.contains('note_save')) {
        btnEdit.style.display = 'block'
        btnSave.style.display = 'none'

        titleField.contentEditable = false
        bodyField.contentEditable = false

        const noteItem = notes.find((item) => {
            return item.id == note.id
        })

        if (noteItem) {
            noteItem.title = titleField.textContent
            noteItem.body = bodyField.textContent
            dataManager.save()
        }
    }
})
