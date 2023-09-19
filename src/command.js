import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { newNote, getAllNotes, findNotes, removeAllNotes } from './notes.js'
import { start } from './server.js'

const listNotes = (notes) => {
  notes.forEach(note => {
    console.log('\n')
    console.log('id: ', note.id)
    console.log('tags: ', note.tags.join(', ')),
    console.log('note: ', note.content)
  })
}
yargs(hideBin(process.argv))
    .command('new <note>', 'Create a new note',
        yargs => {
            return yargs.positional('note', {
                type: 'string',
                description: 'the content of the note',
            })
        }, async (argv) => {
            const tags = argv.tags ? argv.tags.split(',') : []
            const note = await newNote(argv.note, tags)
            console.info('New note added', note)
        })
        .option('tags', {
            alias: 'v',
            type: 'string',
            description: 'tags to add to the note'
        })
        .command('all', 'get all notes', () => {}, async (argv) => {
            const allNotes = await getAllNotes()
            console.info('All notes', allNotes)
        })
        .command('find <filter>', 'get matching notes', yargs => {
          return yargs.positional('filter', {
            describe: 'The search term to filter notes by, will be applied to note.content',
            type: 'string'
          })
        }, async (argv) => {
            const found = await findNotes(argv.filter)
            listNotes(found || [])
        })
        .command('remove <id>', 'remove a note by id', yargs => {
          return yargs.positional('id', {
            type: 'number',
            description: 'The id of the note you want to remove'
          })
        }, async (argv) => {
            const id = await removeNote(argv.id)
            if (id) {
              console.log('Note removed: ', id)
            } else {
              console.log('Note not found')
            }
        })
        .command('web [port]', 'launch website to see notes', yargs => {
          return yargs
            .positional('port', {
              describe: 'port to bind on',
              default: 5000,
              type: 'number'
            })
        }, async (argv) => {
            const notes = await getAllNotes()
            start(notes, argv.port)
        })
        .command('clean', 'remove all notes', () => {}, async (argv) => {
            await removeAllNotes()
            console.log('All notes removed');
        })
        .demandCommand(1)
        .parse()