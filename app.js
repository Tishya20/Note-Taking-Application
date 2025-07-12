let notes = []
let editingNoteId = null
function loadNotes(){
    const savedNotes = localStorage.getItem('quickNotes')
    return savedNotes ? JSON.parse(savedNotes) : []
}

function saveNote(event){
    event.preventDefault()

    const title = document.getElementById('noteTitle').value.trim();
    
    const content = document.getElementById('noteContent').value.trim();

    if(editingNoteId){
        //update existing note
        const noteIndex = notes.findIndex(note => note.id === editingNoteId)
        notes[noteIndex] = {
            ...notes[noteIndex],
            title: title,
            content: content
        }                                                                  
    }else{
        //Add new note
        notes.unshift({
            id: generateId(),
            title: title,
            content: content
        })
    }
    saveNotes()
    renderNotes()
}

function generateId() {
    return Date.now().toString()
}

function saveNotes() {
    localStorage.setItem('quickNotes', JSON.stringify(notes))
}

function deleteNote(noteId){
    notes = notes.filter(note => note.id != noteId)
    saveNotes()
    renderNotes()
}


function renderNotes(){
    const notesContainer = document.getElementById('notesContainer');
    if(notes.length === 0){
        notesContainer.innerHTML =  `
        <div class="empty-state">
        <h2>No notes yet</h2>
        <p>Create your first note to get started!</p>
        <button class="add-note-btn" onClick="openNoteDialog()">+ Add Your First Note</button>
        </div>
        `
        return 
    }

notesContainer.innerHTML = notes.map(note => `
    <div class = "note-card">
    <h3 class="note-title">${note.title}</h3>
    <p class="note-content">${note.content}</p>
    <div class="note-actions">
        <button class="edit-btn" onClick="openNoteDialog('${note.id}')" title="Edit Note"> 
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 21v-3.75L14.85 5.4q.275-.275.688-.275.412 0 .712.275l1.35 1.35q.275.3.275.7t-.275.7L5.75 21Zm3-1.5h.975L17.1 9.35l-.975-.975L6 18.525Zm13.775-13.8-1.35-1.35q-.425-.425-1.025-.425t-1.025.425l-.9.9 2.4 2.4.9-.9q.425-.425.425-1.025t-.425-1.025Z"/>
            
            </svg>
        </button>
        <button class="delete-btn" onClick="deleteNote('${note.id}')" title="Delete Note">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 13.4 7.9 17.5q-.275.275-.675.275t-.7-.275q-.275-.275-.275-.688 0-.412.275-.712l4.1-4.1-4.1-4.075Q6.25 7.75 6.25 7.35q0-.4.275-.7t.7-.3q.425 0 .7.275L12 10.6l4.1-4.075q.3-.275.7-.275.4 0 .7.275.3.3.3.7 0 .4-.3.675L13.4 12l4.1 4.1q.275.275.275.675t-.275.7q-.275.275-.688.275-.412 0-.712-.275Z"/>
            </svg>
        </button>


    </div>

    `).join('')
}

function openNoteDialog(noteId = null){
    const dialog = document.getElementById('noteDialog');
    const titleInput = document.getElementById('noteTitle');
    const contentInput = document.getElementById('noteContent');

    if(noteId){
        const noteToEdit = notes.find(note => note.id === noteId)
        editingNoteId = noteId
        document.getElementById('dialogTitle').textContent = 'Edit Note'
        titleInput.value = noteToEdit.title
        contentInput.value = noteToEdit.content
    } else {
        editingNoteId = null
        document.getElementById('dialogTitle').textContent = 'Add New Note'
        titleInput.value = ''
        contentInput.value = ''
    }
    dialog.showModal();
    titleInput.focus();
}
function closeNoteDialog() {
    document.getElementById('noteDialog').close()
}

function toggleTheme(){
    const isDark = document.body.classList.toggle('dark-theme')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
    document.getElementById('themeToggleBtn').textContent = isDark ? '☀️' : '🌙'

}

function applyStoreTheme() {
    if(localStorage.getItem('theme') === 'dark'){
        document.body.classList.add('dark-theme')
        document.getElementById('themeToggleBtn').textContent = '☀️'
    }
}


document.addEventListener('DOMContentLoaded', function() {
    applyStoreTheme()
    notes = loadNotes()
    renderNotes()

    document.getElementById('noteForm').addEventListener('submit', saveNote) 
    document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme)

    document.getElementById('noteDialog').addEventListener('click', function(event) {
        if(event.target == this){
            closeNoteDialog()
        }
    })

})