import { ChangeEvent, useState } from 'react'
import logo from './assets/Logo.svg'
import { AddNoteCard } from './components/add-note-card'
import { NoteCard } from './components/note-card'

interface Note {
  id: string
  date: Date
  content: string
}

export function App() {

  const [search, setSearch] = useState('')

  const [notes, setNotes] = useState<Note[]>(() => {

    const StoragedNotes = localStorage.getItem('notes')
    if (StoragedNotes) {
      return JSON.parse(StoragedNotes)
    }

    return []
  })

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content: content
    }

    const notesArray = [newNote, ...notes]

    setNotes(notesArray) //estados não podem ser atualizados apenas adicionados. Por isso o operador spred[...] para adicionar todos os dados existente novamente. 

    localStorage.setItem('notes', JSON.stringify(notesArray))

  }

  function onNoteDelete(id: string) {
    const notesArray = notes.filter(note => {
      return note.id !== id
    })

    setNotes(notesArray)

    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value

    setSearch(query)
  }

  const filteredNotes = search !== '' ? notes.filter(note => note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())) : notes


  return (

    <div className='mx-auto max-w-6xl my-12 space-y-6 px-5'>

      <img src={logo} alt='nlw-logo' />
      <form className='w-full'>
        <input
          type="text"
          placeholder='Busque suas notas...'
          className='w-full bg-transparent text-3xl outline-none font-semibold tracking-tighter placeholder:text-slate-500'
          onChange={handleSearch}
        />
      </form>

      <div className='h-px bg-slate-700' />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]'>
        <AddNoteCard onNoteCreated={onNoteCreated} />

        {

          filteredNotes.map(note => {
            return <NoteCard key={note.id} note={note} onNoteDelete={onNoteDelete} />
          })
        }

      </div>

    </div>


  )
}
